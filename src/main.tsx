import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {auth} from './services/firebase';
import {loadSiteContent} from './services/portfolioService';
import './index.css';

// Fetch the Firestore site content and restore the Firebase session before the first render,
// so the UI never flashes the bundled defaults. index.html shows a loader until then.
Promise.all([loadSiteContent(), auth?.authStateReady()]).finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
