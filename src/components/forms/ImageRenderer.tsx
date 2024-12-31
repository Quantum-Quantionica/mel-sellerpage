import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, deleteObject, getDownloadURL } from "firebase/storage";
import { FieldRenderer, FieldRendererPros } from "./Forms";
import { Provider, WithId } from "../../data/provider";
import { deleteField } from "firebase/firestore";
import { snapshotEqual } from "firebase/firestore/lite";

function getFileRef(item: WithId, provider: Provider<any>) {
  const storage = getStorage();
  const fileName = `${provider.collectionName}/${item.id}`;
  const fileRef = ref(storage, fileName);

  return fileRef
}

async function save(item: WithId, provider: Provider<any>) {
  await provider.save(item).then(id => {
    item.id = id;
  });
}

const ImageRenderer = <T extends WithId>({ name, value, onChange, provider, item }: FieldRendererPros<T>) => {
  const [state, setState] = useState('ok');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const deleteImage = async () => {
    const fileRef = getFileRef(item, provider);
    setError(null);
    setState('deleting');
    try {
      await deleteObject(fileRef);
      onChange(null);
      provider.save({ id: item.id, [name]: deleteField() } as Partial<T>);
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setState('ok');
    }
  }

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setError(null);
    try {
      if(item.id == null) {
        await save(item, provider);
        console.warn("Item id is null, saving item first.");
      }
      if (value) {
        await deleteImage()
      }

      setState('uploading');
      const fileRef = getFileRef(item, provider);
      const uploadTask = uploadBytesResumable(fileRef, file)
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        err => {
          console.error("Error uploading image:", err);
          setError("Failed to upload image. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          provider.save({ id: item.id, [name]: downloadURL } as Partial<T>);
          setUploadProgress(0);
        }
      );
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadProgress(0);
      setState('ok');
    }
  };

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
      <button onClick={deleteImage} disabled={state != 'ok' || !value}>Delete</button>
    </div>
  );
};

export default ImageRenderer