// Firebase client: Firestore holds the editable site content, Auth guards admin writes.
// The web config is bundled into client JS and is public by design; access is enforced
// by the Firestore security rules in firestore.rules. Without VITE_FIREBASE_* vars the
// app falls back to localStorage content and the mock admin login.
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseEnabled ? initializeApp(firebaseConfig) : null;

export const db = app ? getFirestore(app) : null;
// Same persistence as getAuth() but without the popup/redirect resolver: only email/password
// sign-in is used, and the resolver adds bundle size and an auth iframe load on startup.
export const auth = app
  ? initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
    })
  : null;
