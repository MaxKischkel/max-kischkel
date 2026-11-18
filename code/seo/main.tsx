import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const container = document.getElementById('root')!;
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
const options = {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error: unknown, errorInfo: { componentStack?: string }) => {
    console.error(error, errorInfo.componentStack);
  },
};

// Vorgerendertes HTML (siehe prerender.mjs) nur übernehmen, wenn es zur aufgerufenen Seite gehört.
// Sonst, z. B. bei unbekannten Adressen, die Seite neu aufbauen.
const sauber = (p: string) => p.replace(/\/+$/, '') || '/';
const vorgerendert = container.dataset.vorgerendert;
if (vorgerendert && sauber(vorgerendert) === sauber(window.location.pathname)) {
  hydrateRoot(container, app, options);
} else {
  if (vorgerendert) container.textContent = '';
  createRoot(container, options).render(app);
}
