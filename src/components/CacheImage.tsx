import React, { useEffect, useState } from "react";

async function hash(url?: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
    
  // Calcula o hash (SHA-256)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Converte o hash para um formato legível (hexadecimal)
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}
async function fetchAndConvertToDataUrl(url: string): string {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
  
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching or converting image:", error);
    throw error;
  }
}

async function getOrFetchImage(url: string|undefined): Promise<string> {
  if(!url) return "";
    
  const cacheName = `image-cache-${await hash(url)}`;
  let cachedDataUrl = localStorage.getItem(cacheName);
  if (!cachedDataUrl) {
    cachedDataUrl = await fetchAndConvertToDataUrl(url);
    localStorage.setItem(cacheName, cachedDataUrl);
    console.log("Image loaded from URL:", url);
  } else {
    console.log("Image loaded from cache:", url);
  }
  return cachedDataUrl || "";
}

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const CachedImage: React.FC<CachedImageProps> = ({ src, ...props }) => {
  const [cachedSrc, setCachedSrc] = useState<string>("");
  const fetchImage = async () => {
    setCachedSrc(await getOrFetchImage(src));
  };

  useEffect(() => {
    if (src) {
      fetchImage();
    }
  }, [src]);

  if (!cachedSrc) return <span>Loading...</span>;
  return <img {...props} src={cachedSrc} />;
};

export default CachedImage;