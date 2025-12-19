import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.wasm', '**/*.onnx'],
  optimizeDeps: {
    exclude: ['@imgly/background-removal']
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks: (id) => {
        //   if (id.includes('node_modules')) {
        //     if (id.includes('pdfjs-dist')) return 'pdfjs-vendor';
        //     if (id.includes('pdf-lib')) return 'pdflib-vendor';
        //     if (id.includes('jspdf')) return 'jspdf-vendor';
        //     if (id.includes('@huggingface/transformers')) return 'ai-vendor';
        //     if (id.includes('fabric')) return 'image-vendor';

        //     // Consolidate React and UI libs into the main vendor chunk to avoid initialization issues
        //     // if (id.includes('lucide-react')) return 'icons-vendor';
        //     // if (id.includes('@radix-ui')) return 'ui-vendor';
        //     // if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';

        //     return 'vendor'; // Catch-all for other node_modules
        //   }
        // },
      },
    },
  },
}));
