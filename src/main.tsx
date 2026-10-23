import {auth} from './services/firebase';
import {loadSiteContent} from './services/portfolioService';
import './index.css';

// Fetch the Firestore site content and restore the Firebase session before the first render,
// so the UI never flashes the bundled defaults. index.html shows a loader until then.
// React and the app are separate chunks so they download in parallel with the fetch
// instead of having to load before it can start.
Promise.all([
  import('react-dom/client'),
  import('./App.tsx'),
  loadSiteContent(),
  auth?.authStateReady(),
]).then(([{createRoot}, {default: App}]) => {
  createRoot(document.getElementById('root')!).render(<App />);
});
