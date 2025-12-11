
import { AutoModel, AutoProcessor, env, RawImage } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

// Singleton to hold model and processor
let model: any = null;
let processor: any = null;

/**
 * Removes background using the SOTA RMBG-1.4 model via transformers.js
 */
export const removeBackground = async (imageSource: HTMLImageElement | Blob | string): Promise<Blob> => {
  try {
    console.log('Starting SOTA Background Removal (RMBG-1.4)...');

    // 1. Load Model & Processor if not already loaded
    if (!model || !processor) {
      console.log('Loading RMBG-1.4 model (this may take a while for the first time)...');
      model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        // Use webgpu if available, otherwise wasm
        device: typeof navigator !== 'undefined' && (navigator as any).gpu ? 'webgpu' : 'wasm',
      });
      processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4');
    }

    // 2. Prepare Image
    let rawImage;
    if (imageSource instanceof Blob) {
      rawImage = await RawImage.fromBlob(imageSource);
    } else if (imageSource instanceof HTMLImageElement) {
      // Create a blob from the image element to ensure consistency
      const response = await fetch(imageSource.src);
      const blob = await response.blob();
      rawImage = await RawImage.fromBlob(blob);
    } else {
      // string (url)
      rawImage = await RawImage.read(imageSource);
    }

    // 3. Pre-process
    console.log('Preprocessing image...');
    const { pixel_values } = await processor(rawImage);

    // 4. Inference
    console.log('Running AI Inference...');
    const { output } = await model({ input: pixel_values });

    // 5. Post-process (Extract Mask)
    // The output is a tensor. We need to convert it to an image mask.
    console.log('Processing mask...');
    const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(rawImage.width, rawImage.height);

    // 6. Apply Mask to Original Image
    const canvas = document.createElement('canvas');
    canvas.width = rawImage.width;
    canvas.height = rawImage.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Draw original image
    const originalCanvas = await rawImage.toCanvas(); // transformers.js RawImage helper
    ctx.drawImage(originalCanvas, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    // Get mask data
    const maskCanvas = await mask.toCanvas();
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) throw new Error('Could not get mask context');
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

    // Apply alpha from mask (RMBG output is a probability map, usually grayscale)
    // We use the red channel of the mask as the alpha value for the main image
    for (let i = 0; i < pixelData.length; i += 4) {
      pixelData[i + 3] = maskData[i]; // Update alpha channel
    }

    // Put new data back
    ctx.putImageData(imageData, 0, 0);

    // 7. Return Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('SOTA Background Removal Complete.');
          resolve(blob);
        }
        else reject(new Error('Failed to create blob from canvas'));
      }, 'image/png');
    });

  } catch (error) {
    console.error('Error in SOTA background removal:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
