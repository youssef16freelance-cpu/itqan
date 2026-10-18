import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegistered(r) {
      console.log('إتقان: تم تسجيل Service Worker بنجاح', r);
    },
    onRegisterError(error) {
      console.warn('إتقان: تعذر تسجيل Service Worker:', error);
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
