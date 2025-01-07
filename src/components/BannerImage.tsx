import React, { CSSProperties, useEffect, useRef, useState } from "react";

export type BannerImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  usePattern?: boolean;
}

interface BannerImageInfo {
  width: number;
  sidewidth: number;
  left: string; leftPattern?: string;
  right: string; rightPattern?: string;
  usePattern?: boolean;
  opacity: number;
}

const sideStyle: CSSProperties = {
  position: 'absolute',
  top: 0, bottom: 0, left: 0, right: 0,
  transition: 'background-color 0.5s, opacity 0.5s',
  filter: 'blur(1px)',
}
const innerStyle: CSSProperties = {
  position: 'absolute', zIndex: 1,
  top: 0, bottom: 0, width: '20px',
  transition: 'background 0.5s, opacity 0.5s',
}

const defaultBannerInfo: BannerImageInfo = {
  left: "rgba(0, 0, 255, 0)", right: "rgba(0, 255, 0, 0)",
  sidewidth: 0, width: 0,
  opacity: 0,
}

const BannerImage = ({ src, usePattern = true }: BannerImageProps) => {
  const [dataURL, setDataURL] = useState<string>();
  const [bannerInfo, setBannerInfo] = useState<BannerImageInfo>(defaultBannerInfo);
  const imageRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const onResize = () => {
    if (!imageRef.current || !boxRef.current) return;
    if (!boxRef.current) return;
    setBannerInfo({ ...bannerInfo, ...calculateSizes(imageRef.current, boxRef.current) });
  }

  useEffect(() => {
    const promisse = fetchAndSetImageData(src)
      .then(dataURL => setDataURL(dataURL))
      .catch(console.error);
    return () => {
      setBannerInfo(defaultBannerInfo);
      setDataURL(undefined);
      promisse.then(() => console.log("Image data fetch cancelled", src));
    }
  }, [src]);

  useEffect(() => {
    if(!imageRef.current) return;
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [src, onResize]);

  return <>
    <div
      ref={boxRef}
      style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
      <div style={{
        ...sideStyle,
        right: bannerInfo.sidewidth + bannerInfo.width,
        backgroundColor: bannerInfo.left,
        background: `url(${bannerInfo.leftPattern}) repeat-x`,
        opacity: bannerInfo.opacity,
      }} />
      {!usePattern && <div style={{
        ...innerStyle,
        left: bannerInfo.sidewidth,
        opacity: dataURL ? 1 : 0,
        background: `linear-gradient(to right, ${bannerInfo.left}, transparent)`,
      }} /> }
      <img className="content" alt="Banner" src={dataURL} ref={imageRef}
        style={{ height: "300px", transition: 'opacity 0.5s', opacity: bannerInfo.opacity }}
        onLoad={(e) => {
          if (!boxRef.current || !src) return;
          setBannerInfo(
            calculateColors(e.currentTarget, boxRef.current, usePattern)
          );
        }}
      />
      {!usePattern && <div style={{
        ...innerStyle,
        right: bannerInfo.sidewidth,
        opacity: dataURL ? 1 : 0,
        background: `linear-gradient(to left, ${bannerInfo.right}, transparent)`,
      }} />}
      <div style={{
        ...sideStyle,
        left: bannerInfo.sidewidth + bannerInfo.width,
        backgroundColor: bannerInfo.right,
        background: `url(${bannerInfo.rightPattern}) repeat-x`,
        opacity: bannerInfo.opacity,
      }} />
    </div>
  </>;
};

export default BannerImage;

const calculateSizes = (image: HTMLImageElement, box: HTMLElement) => {
  // const fullWidth = box ? box.clientWidth : window.innerWidth;
  const fullWidth = box.clientWidth || 0;
  return {
    sidewidth: ((fullWidth - image.width) / 2) - 2,
    width: image.width, opacity: 1
  };
}

const calculateColors = (image: HTMLImageElement, box: HTMLElement, usePattern: boolean = false) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  })!;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const leftColumn = ctx.getImageData(0, 0, 1, image.height).data; // Pixels da coluna esquerda
  const rightColumn = ctx.getImageData(image.width - 1, 0, 1, image.height).data; // Pixels da coluna direita

  return { 
    left: calculateAverageColor(leftColumn),
    right: calculateAverageColor(rightColumn),
    leftPattern: usePattern ? createColumnPattern(leftColumn, image.height) : undefined,
    rightPattern: usePattern ? createColumnPattern(rightColumn, image.height) : undefined,
    ...calculateSizes(image, box)
  } as BannerImageInfo;
};

const calculateAverageColor = (data: Uint8ClampedArray) => {
  let r = 0,g = 0,b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const totalPixels = data.length / 4;
  return `rgb(${Math.round(r / totalPixels)}, ${Math.round(g / totalPixels)}, ${Math.round(b / totalPixels)})`;
};

const createColumnPattern = (data: Uint8ClampedArray, height: number) => {
  const columnCanvas = document.createElement("canvas");
  columnCanvas.width = 1;
  columnCanvas.height = height;
  const columnCtx = columnCanvas.getContext("2d");

  if (!columnCtx) return "transparent";

  const imageData = columnCtx.createImageData(1, height);
  imageData.data.set(data);
  columnCtx.putImageData(imageData, 0, 0);

  return columnCanvas.toDataURL();
};

const cachedImages = new Map<string, string>();

const fetchAndSetImageData = async (imageUrl?: string) => new Promise<string>(async (resolve, reject) => {
  if (!imageUrl) return reject("No image url provided");

  const cached = cachedImages.get(imageUrl);
  if (cached) return resolve(cached);
  try {
    const response = await fetch(imageUrl, { cache: "force-cache" });
    if (!response.ok) reject("Erro ao carregar a imagem");
    
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      reader.onloadend = null;
      cachedImages.set(imageUrl, dataUrl);
      resolve(dataUrl);
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    reject(err);
  }
});