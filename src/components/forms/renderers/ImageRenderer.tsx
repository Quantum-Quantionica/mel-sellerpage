import { useEffect, useRef, useState } from "react";

import { Provider, WithId } from "../../../data/provider";
import { deleteImage, uploadFile } from "../../../configs/firebase";
import { FieldRendererPros } from "../DynamicForm";
import CachedImage from "../../CacheImage";

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
    <div>
      <div>
        <label>{name}: </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
          disabled={state !== 'finish'}
        />
      </div>
      {(value||urlToShow) && (
        <div>
          <CachedImage src={urlToShow||value} alt="Preview" style={{
            maxWidth: "400px", maxHeight: "80px", margin: "10px 0" 
          }} />
          <p>URL: {value}</p>
        </div>
      )}
      {state === 'deleting' && <p>Deleting...</p>}
      {state === 'uploading' && <p>Uploading... {Math.round(uploadProgress)}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleDelete} disabled={state !== 'finish' || !value}>Delete</button>
    </div>
  );
};

export default ImageRenderer

function getFileName(item: WithId, provider: Provider<any>) {
  return `${provider.collectionName}/${item.id}/`;
}