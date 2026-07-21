import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import i18n from './i18n';
import './styles/global.css';
import App from './App';
import './utils/serviceWorker';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

// Sync <html lang> with detected language on boot
document.documentElement.lang = (i18n.resolvedLanguage ?? i18n.language).slice(
  0,
  2
);

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
