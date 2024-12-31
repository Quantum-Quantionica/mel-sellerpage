import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, deleteObject, getDownloadURL } from "firebase/storage";
import { FieldRendererPros } from "./Forms";
import { Provider, WithId } from "../../data/provider";

function getFileRef(item: WithId, provider: Provider<any>) {
  const storage = getStorage();
  const hash = Math.random().toString(36).substring(7);
  const fileName = `${provider.collectionName}/${item.id}/${hash}`;
  const fileRef = ref(storage, fileName);

  return fileRef
}

export async function deleteImage(url: string) {
  const fileRef = ref(getStorage(), url);
  try {
    await deleteObject(fileRef);
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
  return true;
}

const ImageRenderer = <T extends WithId>({ name, value, onChange, provider, item, save }: FieldRendererPros<T>) => {
  const [state, setState] = useState<'ok'|'uploading'|'deleting'>('ok');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setState('deleting');
    if(await deleteImage(value)){
      onChange("");
    } else {
      setError("Failed to delete image. Please try again.");
    }
    setState('ok');
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
    const fileRef = getFileRef(item, provider);
    const uploadTask = uploadBytesResumable(fileRef, file)
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
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onChange(downloadURL);
        setUploadProgress(0);
        setState('ok');
      }
    );
  };

  useEffect(() => {
    if(item.id) {
      save()
    }
  } ,[value]);

  return (
    <div>
      <label>{name}</label>
      {value && (
        <div>
          <img src={value} alt="Preview" style={{ width: "100%", maxWidth: "600px", margin: "10px 0" }} />
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
        disabled={state != 'ok'}
      />
      {state == 'deleting' && <p>Deleting...</p>}
      {state == 'uploading' && <p>Uploading... {Math.round(uploadProgress)}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleDelete} disabled={state != 'ok' || !value}>Delete</button>
    </div>
  );
};

export default ImageRenderer