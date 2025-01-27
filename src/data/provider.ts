import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, addDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../configs/firebase";

const maxRequestsPerSecond = 10;
let requestsOnLastSecond = 0;
setInterval(() => {
  requestsOnLastSecond = 0;
}, 1000);
function allertIfTooManyRequests() {
  requestsOnLastSecond++;
  if (requestsOnLastSecond > maxRequestsPerSecond) {
    alert("Too many requests on last second");
  }
}

export interface WithId {
  id?: string;
}

export interface Provider<T extends WithId> {
  keys: (keyof T)[];
  collectionName: string;
  listAll: (filter?: Partial<T>) => Promise<T[]>;
  save: (item: Partial<T>, validate: boolean) => Promise<Partial<T>>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Promise<T | null>;
}

export type ProviderArrayFilter<T> = (list: T[]) => T[];
export type ProviderArrayFilters<T> = {[key in keyof T]?: ProviderArrayFilter<any>};
export default abstract class AbstractFirestoreProvider<T extends WithId> implements Provider<T> {
  public abstract collectionName: string;
  public abstract keys: (keyof T)[];
  protected arrayFieldsFilter: ProviderArrayFilters<T> = {};
  protected abstract requiredFields: (keyof T)[];

  protected filterData(item: Partial<T>) {
    for (const entry of Object.entries(this.arrayFieldsFilter)) {
      const key = entry[0] as keyof T;
      const filter = entry[1] as ProviderArrayFilter<string>;
      item[key] = filter(item[key]);
    }
    return item;
  }

  private validateData(item: Partial<T>) {
    for (const key of this.requiredFields) {
      if (!item[key] || (typeof item[key] === "string" && item[key].trim() === "")) {
        throw new Error(`Field ${key} is required`);
      }
    }
  }

  async listAll(filter?: Partial<T>): Promise<T[]> {
    allertIfTooManyRequests();
    const ref = collection(db, this.collectionName);
    let q = query(ref);

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (Array.isArray(value)) {
          if (value.length === 1) {
            q = query(q, where(key, "array-contains", value[0]));
          } else if (value.length > 1) {
            q = query(q, where(key, "array-contains-any", value));
          }
        } else if (value !== undefined) {
          q = query(q, where(key, "==", value));
        }
      }
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async getOne(filter: Partial<T>): Promise<T | null> {
    const list = await this.listAll(filter);
    return list.length > 0 ? list[0] : null;
  }

  async save(item: Partial<T>, validate: boolean = false): Promise<Partial<T>> {
    allertIfTooManyRequests();
    item = this.cleanObject(item);
    this.filterData(item);
    if(validate) this.validateData(item);
    const partialItem = { ...item, updatedAt: serverTimestamp() } as Partial<T>;
    if (item.id) {
      partialItem.id = deleteField() as any;
      const ref = doc(db, this.collectionName, item.id);
      console.log("Document updated with ID:", item.id, item);
      await setDoc(ref, partialItem, { merge: true });
    } else {
      partialItem.createdAt = serverTimestamp();
      const ref = collection(db, this.collectionName);
      const newDocRef = await addDoc(ref, partialItem);
      console.log("New document created with ID:", newDocRef.id);
      item.id = newDocRef.id;
    }
    return item;
  }

  async delete(id: string): Promise<void> {
    allertIfTooManyRequests();
    const ref = doc(db, this.collectionName, id);
    await deleteDoc(ref);
  }

  async getById(id: string): Promise<T | null> {
    allertIfTooManyRequests();
    const ref = doc(db, this.collectionName, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as T;
  }

  private cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .map(item => this.cleanObject(item))
        .filter(item => item !== null && item !== undefined && item !== "" && !(typeof item === "object" && Object.keys(item).length === 0));
    } else if (typeof obj === "string") {
      return obj.trim();
    } else if (obj !== null && typeof obj === "object") {
      const cleanedObj = Object.keys(obj).reduce((acc, key) => {
        const value = this.cleanObject(obj[key]);
        if (value !== null && value !== undefined && value !== "" && !(typeof value === "object" && Object.keys(value).length === 0)) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      return Object.keys(cleanedObj).length === 0 ? null : cleanedObj;
    }
    return obj;
  }
}