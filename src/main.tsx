import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handler for chunk loading failures (MIME type mismatch, 404s)
// This happens when a new version is deployed and the user is on an old cached version
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    console.log('Chunk load failed, reloading...', event);
    window.location.reload()
})

createRoot(document.getElementById("root")!).render(<App />);
