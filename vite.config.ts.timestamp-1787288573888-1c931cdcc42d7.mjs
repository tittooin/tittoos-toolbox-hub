// vite.config.ts
import { defineConfig } from "file:///G:/axevora.com/tittoos-toolbox-hub/node_modules/vite/dist/node/index.js";
import react from "file:///G:/axevora.com/tittoos-toolbox-hub/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "G:\\axevora.com\\tittoos-toolbox-hub";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "credentialless"
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8788",
        changeOrigin: true
      }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxheGV2b3JhLmNvbVxcXFx0aXR0b29zLXRvb2xib3gtaHViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxheGV2b3JhLmNvbVxcXFx0aXR0b29zLXRvb2xib3gtaHViXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9heGV2b3JhLmNvbS90aXR0b29zLXRvb2xib3gtaHViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkNyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5XCI6IFwic2FtZS1vcmlnaW4tYWxsb3ctcG9wdXBzXCIsXHJcbiAgICAgIFwiQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeVwiOiBcImNyZWRlbnRpYWxsZXNzXCIsXHJcbiAgICB9LFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4Nzg4XCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBhc3NldHNJbmNsdWRlOiBbJyoqLyoud2FzbScsICcqKi8qLm9ubngnXSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFsnQGltZ2x5L2JhY2tncm91bmQtcmVtb3ZhbCddXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xyXG4gICAgICAgIC8vICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgIC8vICAgICBpZiAoaWQuaW5jbHVkZXMoJ3BkZmpzLWRpc3QnKSkgcmV0dXJuICdwZGZqcy12ZW5kb3InO1xyXG4gICAgICAgIC8vICAgICBpZiAoaWQuaW5jbHVkZXMoJ3BkZi1saWInKSkgcmV0dXJuICdwZGZsaWItdmVuZG9yJztcclxuICAgICAgICAvLyAgICAgaWYgKGlkLmluY2x1ZGVzKCdqc3BkZicpKSByZXR1cm4gJ2pzcGRmLXZlbmRvcic7XHJcbiAgICAgICAgLy8gICAgIGlmIChpZC5pbmNsdWRlcygnQGh1Z2dpbmdmYWNlL3RyYW5zZm9ybWVycycpKSByZXR1cm4gJ2FpLXZlbmRvcic7XHJcbiAgICAgICAgLy8gICAgIGlmIChpZC5pbmNsdWRlcygnZmFicmljJykpIHJldHVybiAnaW1hZ2UtdmVuZG9yJztcclxuXHJcbiAgICAgICAgLy8gICAgIC8vIENvbnNvbGlkYXRlIFJlYWN0IGFuZCBVSSBsaWJzIGludG8gdGhlIG1haW4gdmVuZG9yIGNodW5rIHRvIGF2b2lkIGluaXRpYWxpemF0aW9uIGlzc3Vlc1xyXG4gICAgICAgIC8vICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSByZXR1cm4gJ2ljb25zLXZlbmRvcic7XHJcbiAgICAgICAgLy8gICAgIC8vIGlmIChpZC5pbmNsdWRlcygnQHJhZGl4LXVpJykpIHJldHVybiAndWktdmVuZG9yJztcclxuICAgICAgICAvLyAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSB8fCBpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyLWRvbScpKSByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XHJcblxyXG4gICAgICAgIC8vICAgICByZXR1cm4gJ3ZlbmRvcic7IC8vIENhdGNoLWFsbCBmb3Igb3RoZXIgbm9kZV9tb2R1bGVzXHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCw4QkFBOEI7QUFBQSxNQUM5QixnQ0FBZ0M7QUFBQSxJQUNsQztBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlLENBQUMsYUFBYSxXQUFXO0FBQUEsRUFDeEMsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLDJCQUEyQjtBQUFBLEVBQ3ZDO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BaUJSO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
