import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { getAnalytics, logEvent as FirebaseLogEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from './firebaseConfig.json';

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const logEvent = FirebaseLogEvent;
export const db = getFirestore(app);
export const storage = getStorage();

export const deleteFolder = async (folderPath: string) => {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);

  // Excluir todos os arquivos
  const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));
  await Promise.all(deletePromises);

  // Excluir subpastas (se houver)
  const subfolderDeletePromises = result.prefixes.map((subfolderRef) =>
    deleteFolder(subfolderRef.fullPath)
  );
  await Promise.all(subfolderDeletePromises);

  console.log(`Folder "${folderPath}" deleted successfully.`);
};

// Exemplo de uso
deleteFolder("images/some-folder");