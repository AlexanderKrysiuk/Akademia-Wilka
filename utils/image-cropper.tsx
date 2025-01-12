import React, { useRef, useState } from "react";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";

// Stałe
const MIN_DIMENSION = 100;
const ASPECT_RATIO = 16 / 9;

// Typy pomocnicze
export type CropState = {
  crop: Crop | undefined;
  file: File | null;
  imgRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export function ImageCropper() {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>();

  // Funkcja ładowania obrazu z pliku
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      throw new Error(`Minimalne wymiary obrazka to ${MIN_DIMENSION} px`);
    }
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(centerCrop(crop, width, height));
  };

  // Funkcja zmiany podglądu na canvasie
  const setCanvasPreview = (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: Crop
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Brak kontekstu");
    }
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
    ctx.restore();
  };

  // Funkcja do obsługi pliku obrazu
  const onFileChange = (file: File) => {
    setFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImgSrc(objectUrl);
  };

  return {
    crop,
    file,
    imgSrc,
    imgRef,
    previewCanvasRef,
    setCrop,
    setImgSrc,
    onImageLoad,
    setCanvasPreview,
    onFileChange,
  };
}
