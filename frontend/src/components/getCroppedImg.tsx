export default function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((file) => {
      const newUrl = URL.createObjectURL(file!);
      resolve(newUrl);
    }, 'image/jpeg');
  });
}