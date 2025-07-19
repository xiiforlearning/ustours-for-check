import { Area } from "react-easy-crop";

export default function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Failed to get canvas context");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };

    image.onerror = () => reject("Failed to load image");
  });
}
