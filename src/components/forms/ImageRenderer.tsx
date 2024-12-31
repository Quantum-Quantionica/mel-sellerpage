import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, deleteObject, getDownloadURL } from "firebase/storage";

import { FieldRendererPros } from "./Forms";
import { Provider, WithId } from "../../data/provider";
import { storage } from "../../configs/firebase";
import CachedImage from "../CacheImage";

function getFileRef(item: WithId, provider: Provider<any>) {
  const hash = Math.random().toString(36).substring(7);
  const fileName = `${provider.collectionName}/${item.id}/${hash}`;
  const fileRef = ref(storage, fileName);

  return fileRef
}

const globalPromises = {
  list: [] as Promise<any>[],
  addPromise(promise: Promise<any>) {
    this.list.push(promise);
    promise.finally(() => {
      const index = this.list.indexOf(promise);
      if (index > -1) {
        this.list.splice(index, 1);
      }
    });
    return promise;
  },
  waitAll: async () => await Promise.all(globalPromises.list)
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

const ImageRenderer = <T extends WithId>({ name, value, onChange, provider, item, save }: FieldRendererPros<T>) => {
  const [state, setState] = useState<'initial'|'uploading'|'deleting'|'finish'>('initial');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setState('deleting');
    await globalPromises.waitAll();
    if(await globalPromises.addPromise(deleteImage(value))){
      onChange("");
    } else {
      setError("Failed to delete image. Please try again.");
    }
    setState('finish');
  }

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setError(null);
    if(item.id == null) {
      item.id = (await save()).id;
      console.warn("Item id is null, saving item first.");
    }
    if (value) {
      await handleDelete()
    }

    setState('uploading');
    await globalPromises.waitAll();
    const fileRef = getFileRef(item, provider);
    await globalPromises.addPromise(new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, file, {
        cacheControl: "public, max-age=31536000",
        contentType: file.type,
      })
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);
        },
        err => {
          console.error("Error uploading image:", err);
          setError("Failed to upload image. Please try again.");
          reject(err);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setUploadProgress(0);
          setState('finish');
          resolve(downloadURL);
        }
      );
    }));
  };

  useEffect(() => {
    if (item.id && value && state != 'initial') {
      save();
    }
    setState('finish');
  }, [value]);

  return (
    <div>
      <label>{name}</label>
      {value && (
        <div>
          <CachedImage src={value} alt="Preview" style={{ width: "100%", maxWidth: "600px", margin: "10px 0" }} />
          <p>URL: {value}</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        disabled={state != 'finish'}
      />
      {state == 'deleting' && <p>Deleting...</p>}
      {state == 'uploading' && <p>Uploading... {Math.round(uploadProgress)}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleDelete} disabled={state != 'finish' || !value}>Delete</button>
    </div>
  );
};

export default ImageRenderer