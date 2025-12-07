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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist')) return 'pdf-vendor';
            if (id.includes('@huggingface/transformers')) return 'ai-vendor';
            if (id.includes('fabric')) return 'image-vendor';
            if (id.includes('xlsx') || id.includes('docx') || id.includes('pptxgenjs') || id.includes('mammoth')) return 'office-vendor';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('@radix-ui') || id.includes('lucide-react')) return 'ui-vendor';
          }
        },
      },
    },
  },
}));
