
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg) return ffmpeg;

    ffmpeg = new FFmpeg();

    // Load from specific CDN version to ensure compatibility
    // Using unpkg for 0.12.10 (Matching @ffmpeg/ffmpeg version)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';

    // Note: We are using the MULTI-THREADED core by default.
    // If you see "SharedArrayBuffer is not defined" error in production,
    // you need to add COOP/COEP headers to your server.

    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    } catch (error) {
        console.error("FFmpeg load failed:", error);
        throw new Error("Failed to load FFmpeg. Check browser console for COOP/COEP errors or network issues.");
    }

    return ffmpeg;
};

export interface ConversionOptions {
    file: File;
    outputFormat: string;
    onProgress?: (progress: number) => void;
    bitrate?: string; // e.g., "192k"
}

export const convertMedia = async ({ file, outputFormat, onProgress, bitrate }: ConversionOptions): Promise<string> => {
    const ffmpeg = await loadFFmpeg();

    const inputName = `input.${file.name.split('.').pop()}`;
    const outputName = `output.${outputFormat}`;

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Progress Handler
    ffmpeg.on('progress', ({ progress }) => {
        if (onProgress) {
            // ffmpeg 0.12.x reports progress from 0 to 1
            onProgress(Math.round(progress * 100));
        }
    });

    // Construct Command
    // -i input -b:a bitrate (if audio) output
    const args = ['-i', inputName];

    if (bitrate) {
        args.push('-b:a', bitrate);
    }

    // Add preset for speed (optional but good for UX)
    // args.push('-preset', 'ultrafast');

    args.push(outputName);

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);

    const blob = new Blob([data as any], { type: getTypeFromFormat(outputFormat) });
    const url = URL.createObjectURL(blob);

    // Cleanup
    // await ffmpeg.deleteFile(inputName);
    // await ffmpeg.deleteFile(outputName);
    // Be careful deleting if the user wants to download again, keeping for now or handle cleanup externally?
    // Usually FFmpeg memory is virtual file system, good to clean up if converting multiple times.
    try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
    } catch (e) {
        // ignore cleanup errors
    }

    return url;
};

const getTypeFromFormat = (format: string): string => {
    switch (format) {
        case 'mp3': return 'audio/mpeg';
        case 'wav': return 'audio/wav';
        case 'mp4': return 'video/mp4';
        case 'avi': return 'video/x-msvideo';
        case 'mov': return 'video/quicktime';
        case 'webm': return 'video/webm';
        case 'aac': return 'audio/aac';
        case 'flac': return 'audio/flac';
        case 'ogg': return 'audio/ogg';
        case 'm4a': return 'audio/mp4';
        default: return 'application/octet-stream';
    }
};
