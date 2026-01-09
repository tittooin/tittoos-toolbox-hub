// vite.config.ts
import { defineConfig } from "file:///G:/Tittoos.online/tittoos-toolbox-hub/node_modules/vite/dist/node/index.js";
import react from "file:///G:/Tittoos.online/tittoos-toolbox-hub/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "G:\\Tittoos.online\\tittoos-toolbox-hub";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless"
    }
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  assetsInclude: ["**/*.wasm", "**/*.onnx"],
  optimizeDeps: {
    exclude: ["@imgly/background-removal"]
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
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxUaXR0b29zLm9ubGluZVxcXFx0aXR0b29zLXRvb2xib3gtaHViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxUaXR0b29zLm9ubGluZVxcXFx0aXR0b29zLXRvb2xib3gtaHViXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9UaXR0b29zLm9ubGluZS90aXR0b29zLXRvb2xib3gtaHViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkNyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5XCI6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgXCJDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5XCI6IFwiY3JlZGVudGlhbGxlc3NcIixcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndhc20nLCAnKiovKi5vbm54J10sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBleGNsdWRlOiBbJ0BpbWdseS9iYWNrZ3JvdW5kLXJlbW92YWwnXVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgLy8gbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAvLyAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAvLyAgICAgaWYgKGlkLmluY2x1ZGVzKCdwZGZqcy1kaXN0JykpIHJldHVybiAncGRmanMtdmVuZG9yJztcclxuICAgICAgICAvLyAgICAgaWYgKGlkLmluY2x1ZGVzKCdwZGYtbGliJykpIHJldHVybiAncGRmbGliLXZlbmRvcic7XHJcbiAgICAgICAgLy8gICAgIGlmIChpZC5pbmNsdWRlcygnanNwZGYnKSkgcmV0dXJuICdqc3BkZi12ZW5kb3InO1xyXG4gICAgICAgIC8vICAgICBpZiAoaWQuaW5jbHVkZXMoJ0BodWdnaW5nZmFjZS90cmFuc2Zvcm1lcnMnKSkgcmV0dXJuICdhaS12ZW5kb3InO1xyXG4gICAgICAgIC8vICAgICBpZiAoaWQuaW5jbHVkZXMoJ2ZhYnJpYycpKSByZXR1cm4gJ2ltYWdlLXZlbmRvcic7XHJcblxyXG4gICAgICAgIC8vICAgICAvLyBDb25zb2xpZGF0ZSBSZWFjdCBhbmQgVUkgbGlicyBpbnRvIHRoZSBtYWluIHZlbmRvciBjaHVuayB0byBhdm9pZCBpbml0aWFsaXphdGlvbiBpc3N1ZXNcclxuICAgICAgICAvLyAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSkgcmV0dXJuICdpY29ucy12ZW5kb3InO1xyXG4gICAgICAgIC8vICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpKSByZXR1cm4gJ3VpLXZlbmRvcic7XHJcbiAgICAgICAgLy8gICAgIC8vIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtZG9tJykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LXJvdXRlci1kb20nKSkgcmV0dXJuICdyZWFjdC12ZW5kb3InO1xyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuICd2ZW5kb3InOyAvLyBDYXRjaC1hbGwgZm9yIG90aGVyIG5vZGVfbW9kdWxlc1xyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLG9CQUFvQjtBQUNwVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsOEJBQThCO0FBQUEsTUFDOUIsZ0NBQWdDO0FBQUEsSUFDbEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZSxDQUFDLGFBQWEsV0FBVztBQUFBLEVBQ3hDLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQywyQkFBMkI7QUFBQSxFQUN2QztBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWlCUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
