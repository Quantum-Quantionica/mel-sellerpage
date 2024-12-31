import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, addDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../configs/firebase";

export interface WithId {
  id?: string;
}

export interface Provider<T extends WithId> {
  keys: (keyof T)[];
  collectionName: string;
  listAll: (filter?: Partial<T>) => Promise<T[]>;
  save: (item: Partial<T>) => Promise<string>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => Promise<T | null>;
}

export default abstract class AbstractFirestoreProvider<T extends WithId> implements Provider<T> {
  public abstract collectionName: string;
  public abstract keys: (keyof T)[];

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

  async save(item: Partial<T>): Promise<string> {
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
    return item.id;
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