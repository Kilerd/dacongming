import { CompositionConfig, ImageDimensions } from "../types";

const IMAGE_LOAD_TIMEOUT = 10000; // 10 seconds
const TARGET_IMAGE_HEIGHT = 200; // Fixed height for uploaded image
const TEXT_FONT_SIZE = 34;
const TEXT_BOTTOM_MARGIN = 20;
const JPEG_QUALITY = 0.9;

/**
 * Load an image from URL or File object
 */
export function loadImage(src: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      reject(new Error("Image load timeout"));
    }, IMAGE_LOAD_TIMEOUT);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Failed to load image"));
    };

    if (typeof src === "string") {
      img.src = src;
    } else {
      const objectUrl = URL.createObjectURL(src);
      img.src = objectUrl;
      // Clean up object URL after image loads
      img.onload = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
    }
  });
}

/**
 * Calculate scaled dimensions maintaining aspect ratio with fixed height
 */
export function calculateScaledDimensions(
  original: ImageDimensions,
  targetHeight: number,
): ImageDimensions {
  const scaledWidth = (original.width / original.height) * targetHeight;
  return {
    width: scaledWidth,
    height: targetHeight,
  };
}

/**
 * Compose image with background, user image, and text
 */
export async function composeImage(config: CompositionConfig): Promise<string> {
  const { backgroundUrl, userImage, text } = config;

  // Load background image to get dimensions
  const bgImg = await loadImage(backgroundUrl);
  const canvasWidth = bgImg.width;
  const canvasHeight = bgImg.height;

  // Create offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not supported");
  }

  // Draw background
  ctx.drawImage(bgImg, 0, 0);

  // Load and draw user image at top-left
  const userImg = await loadImage(userImage);
  const scaledDimensions = calculateScaledDimensions(
    { width: userImg.width, height: userImg.height },
    TARGET_IMAGE_HEIGHT,
  );
  ctx.drawImage(
    userImg,
    20,
    20,
    scaledDimensions.width,
    scaledDimensions.height,
  );

  // Draw text at bottom center
  const displayText = `你还能有 ${text} 聪明`;
  ctx.font = `${TEXT_FONT_SIZE}px sans-serif`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(displayText, canvasWidth / 2, canvasHeight - TEXT_BOTTOM_MARGIN);

  // Convert to data URL
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/**
 * Download image with given filename
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy image to clipboard
 * Converts data URL to canvas then to PNG blob for better compatibility
 */
export async function copyToClipboard(dataUrl: string): Promise<void> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error("Clipboard API not supported");
  }

  try {
    // Load the data URL as an image
    const img = await loadImage(dataUrl);

    // Create a canvas and draw the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Cannot get canvas context');
    }

    ctx.drawImage(img, 0, 0);

    // Convert canvas to PNG blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    });

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  } catch (err) {
    console.error('Clipboard copy error:', err);
    throw new Error('Failed to copy image to clipboard');
  }
}
