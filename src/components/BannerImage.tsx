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

const BannerImage = ({ src, usePattern = true }: BannerImageProps) => {
  const [dataURL, setDataURL] = useState<string>();
  const [bannerInfo, setBannerInfo] = useState<BannerImageInfo>({
    left: "rgba(0, 0, 255, 0)", right: "rgba(0, 255, 0, 0)",
    sidewidth: 0, width: 0,
    opacity: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (src) {
      fetchAndSetImageData(src)
        .then(dataURL => setDataURL(dataURL))
        .catch(console.error);
    }
  }, [src]);

  return <>
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{
        ...sideStyle,
        right: bannerInfo.sidewidth + bannerInfo.width,
        backgroundColor: bannerInfo.left,
        background: `url(${bannerInfo.leftPattern}) repeat-x`,
      }} />
      {!usePattern && <div style={{
        ...innerStyle,
        left: bannerInfo.sidewidth,
        opacity: dataURL ? 1 : 0,
        background: `linear-gradient(to right, ${bannerInfo.left}, transparent)`,
      }} /> }
      <img className="content" alt="Banner" src={dataURL}
        style={{ height: "300px", transition: 'opacity 0.5s', opacity: bannerInfo.opacity }}
        onLoad={(e) => {
          const info = calculateColors(e.currentTarget, canvasRef.current, usePattern);
          if (info) setBannerInfo(info);
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
      }} />
    </div>
  </>;
};

export default BannerImage;

const calculateColors = (image: HTMLImageElement, canvas: HTMLCanvasElement | null, usePattern: boolean = false) => {
  if (!canvas) return;

  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const leftColumn = ctx.getImageData(0, 0, 1, image.height).data; // Pixels da coluna esquerda
  const rightColumn = ctx.getImageData(image.width - 1, 0, 1, image.height).data; // Pixels da coluna direita

  return { 
    left: calculateAverageColor(leftColumn),
    right: calculateAverageColor(rightColumn),
    leftPattern: usePattern ? createColumnPattern(leftColumn, image.height) : undefined,
    rightPattern: usePattern ? createColumnPattern(rightColumn, image.height) : undefined,
    sidewidth: ((window.innerWidth - image.width) / 2) - 2,
    width: image.width, opacity: 1
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

const fetchAndSetImageData = async (imageUrl: string) => new Promise<string>(async (resolve, reject) => {
  try {
    const response = await fetch(imageUrl, { cache: "force-cache" });
    if (!response.ok) reject("Erro ao carregar a imagem");
    
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl);
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    reject(err);
  }
});