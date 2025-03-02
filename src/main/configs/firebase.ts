import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

  const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));
  await Promise.all(deletePromises);

  await Promise.all(result.prefixes.map((subfolderRef) =>
    deleteFolder(subfolderRef.fullPath)
  ));

  console.log(`Folder "${folderPath}" deleted successfully.`);
};

export async function deleteImage(url: string) {
  const fileRef = ref(storage, url);
  try {
    await deleteObject(fileRef);
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
  return true;
}

export const uploadFile = async (
  file: File, fileName: string, progressCallBack: (percentage: number) => void
): Promise<string> => (new Promise((resolve, reject) => {
  const fileRef = ref(storage, fileName + uniqid());
  const uploadTask = uploadBytesResumable(fileRef, file, {
    cacheControl: "public, max-age=31536000, immutable",
    contentType: file.type,
  })
  uploadTask.on(
    "state_changed",
    snapshot => {
      progressCallBack((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    },
    err => {
      console.error("Error uploading image:", err);
      reject(err);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      resolve(downloadURL);
    }
  );
}));

function uniqid():string{
  return (new Date()).getTime().toString(16).slice(2) +
    Math.random().toString(16).slice(2);
}