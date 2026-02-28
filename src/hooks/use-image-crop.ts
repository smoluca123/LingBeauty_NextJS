import { type PixelCrop } from 'react-image-crop';

/**
 * Converts a cropped canvas region into a File object.
 * Uses an offscreen canvas to draw only the cropped portion of the image.
 */
export async function getCroppedImageFile(
  imageElement: HTMLImageElement,
  pixelCrop: PixelCrop,
  fileName: string = 'avatar.jpg',
): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;

  // Calculate actual pixel coordinates on the source image
  const cropX = pixelCrop.x * scaleX;
  const cropY = pixelCrop.y * scaleY;
  const cropWidth = pixelCrop.width * scaleX;
  const cropHeight = pixelCrop.height * scaleY;

  // Set output canvas size to exactly the cropped dimensions
  // This ensures we get the highest quality possible based on original image
  canvas.width = Math.floor(cropWidth);
  canvas.height = Math.floor(cropHeight);

  // Draw the cropped region from original image onto the canvas
  ctx.drawImage(
    imageElement,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.92,
    );
  });
}
