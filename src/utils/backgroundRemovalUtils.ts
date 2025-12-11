

/**
 * Removes background using @imgly/background-removal
 * This library runs entirely in the browser using WebAssembly.
 */
export const removeBackground = async (imageSource: HTMLImageElement | Blob | string): Promise<Blob> => {
  try {
    console.log('Starting AI-powered background removal process with @imgly...');

    // Dynamic import to avoid build issues with Rollup/Vite static analysis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = await import("@imgly/background-removal") as any;
    const removeBackgroundImgly = pkg.default || pkg;

    // configuration for the removal
    const config = {
      progress: (key: string, current: number, total: number) => {
        console.log(`Downloading ${key}: ${Math.round((current / total) * 100)}%`);
      },
      debug: true,
      model: 'medium', // 'small' is faster, 'medium' is better quality. defaulting to medium for quality.
    };

    const blob = await removeBackgroundImgly(imageSource, config);

    console.log('Successfully created professional quality result');
    return blob;

  } catch (error) {
    console.error('Error in AI background removal:', error);
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
