import { useEffect, useRef, useState } from "react";

import './ImageRenderer.css';
import { Provider, WithId } from "../../../main/data/provider";
import { deleteImage, uploadFile } from "../../../main/configs/firebase";
import { FieldRendererPros } from "../DynamicForm";
import CachedImage from "../../../components/CacheImage";
import Icon, { Icons } from "../../../components/Icons";

const ImageRenderer = <T extends WithId>({ name, value, onChange, provider, item, save }: FieldRendererPros<T>) => {
  const [state, setState] = useState<'uploading'|'deleting'|'finish'>('finish');
  const [urlToShow, setUrlToShow] = useState<string>(value);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const prevValueRef = useRef<boolean>(false);
  const triggerOnChange = (value: string) => {
    prevValueRef.current = true;
    onChange(value);
  }
  useEffect(() => {
    if (prevValueRef.current === true) {
      save();
      prevValueRef.current = false;
    }
  }, [value, save]);

  const handleDelete = async () => {
    setState('deleting');
    if(await deleteImage(value)){
      triggerOnChange("");
      setUrlToShow("");
    } else {
      setError("Failed to delete image. Please try again.");
    }
    setState('finish');
  }

  const handleFileChange = async (file: File) => {
    if (!file) return;
    if(!item.id) {
      item.id = (await save()).id;
      console.warn("Item id is null, saving item first.");
    }
    if (value && value !== "") await handleDelete()

    setError(null);
    setState('uploading');
    setUrlToShow(URL.createObjectURL(file));
    uploadFile(file, getFileName(item, provider), setUploadProgress)
      .then(resultUrl => {
        triggerOnChange(resultUrl)
        setUploadProgress(0);
        setState('finish');  
      })
      .catch(() => setError("Failed to upload image. Please try again."))
  };

  return (
    <div className="image-renderer">
      <div className="image-preview">
        {(value||urlToShow) && (
          <CachedImage src={urlToShow||value} alt="Preview" />
        )}
      </div>
      <div className="image-info">
        <label>{name}: </label>
        <input type="file" accept="image/*" disabled={state !== 'finish'}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }} />
        <p className="image-url">{value || "No image uploaded"}</p>
      </div>
      {state === 'deleting' && <p>Deleting...</p>}
      {state === 'uploading' && <p>Uploading... {Math.round(uploadProgress)}%</p>}
      {error && <p className="error-message">{error}</p>}
      <button className="delete-button" onClick={handleDelete} disabled={state !== 'finish' || !value}>
        <Icon icon={Icons.solid.faTrash} /> Delete
      </button>
    </div>
  );
};

export default ImageRenderer

function getFileName(item: WithId, provider: Provider<any>) {
  return `${provider.collectionName}/${item.id}/`;
}