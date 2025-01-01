import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, addDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../configs/firebase";

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
export type ProviderArrayFilters<T> = {[key in keyof T]?: ProviderArrayFilter<string>};
export default abstract class AbstractFirestoreProvider<T extends WithId> implements Provider<T> {
  public abstract collectionName: string;
  public abstract keys: (keyof T)[];
  protected abstract arrayFieldsFilter: ProviderArrayFilters<T>
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
    const ref = collection(db, this.collectionName);
    let q = query(ref);

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined) {
          q = query(q, where(key, "==", value));
        }
      }
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async save(item: Partial<T>, validate: boolean = false): Promise<Partial<T>> {
    this.filterData(item);
    if(validate) this.validateData(item);
    const partialItem = { ...item, updatedAt: serverTimestamp() };
    if (item.id) {
      partialItem.id = deleteField();
      const ref = doc(db, this.collectionName, item.id);
      await setDoc(ref, partialItem, { merge: true });
      console.log("Document updated with ID:", item.id);
    } else {
      partialItem.createdAt = serverTimestamp();
      const ref = collection(db, this.collectionName);
      const newDocRef = await addDoc(ref, partialItem);
      item.id = newDocRef.id;
      console.log("New document created with ID:", newDocRef.id);
    }
    return item;
  }

  async delete(id: string): Promise<void> {
    const ref = doc(db, this.collectionName, id);
    await deleteDoc(ref);
  }

  async getById(id: string): Promise<T | null> {
    const ref = doc(db, this.collectionName, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() } as T;
  }
}