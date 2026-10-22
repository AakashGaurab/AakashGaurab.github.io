import { User } from '../types';
import { SITE_CONFIG } from '../config/site.config';
import { signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

export interface IAuthService {
  getCurrentUser(): User | null;
  login(email: string, password: string):Promise<User>;
  logout(): void;
  isAuthenticated(): boolean;
}

const AUTH_STORAGE_KEY = 'obsidian_studio_auth_session';

class AuthService implements IAuthService {
  private readonly defaultAdmin: User = {
    id: 'usr_admin_01',
    name: SITE_CONFIG.persona.name,
    email: 'admin@obsidian.studio',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };

  // With Firebase configured, the session is Firebase Auth's; main.tsx waits for
  // auth.authStateReady() before rendering, so currentUser is settled by then.
  private toUser(fbUser: FirebaseUser): User {
    return {
      ...this.defaultAdmin,
      id: fbUser.uid,
      email: fbUser.email ?? '',
      name: fbUser.displayName || SITE_CONFIG.persona.name
    };
  }

  getCurrentUser(): User | null {
    if (auth) {
      return auth.currentUser ? this.toUser(auth.currentUser) : null;
    }
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  }

  async login(email: string, password: string): Promise<User> {
    if (auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        return this.toUser(credential.user);
      } catch (e: any) {
        // Wrong credentials get a friendly message; setup errors (e.g. Email/Password
        // provider not enabled) are shown as-is so they can be diagnosed.
        if (e?.code === 'auth/invalid-credential' || e?.code === 'auth/invalid-email') {
          throw new Error('Invalid email or password.');
        }
        console.error('Firebase sign-in failed', e);
        throw new Error(e?.message || 'Sign-in failed.');
      }
    }

    // Artificial latency simulation for realistic UI feel
    await new Promise((resolve) => setTimeout(resolve, 450));

    const normalizedEmail = email.trim().toLowerCase();
    
    // Accept standard admin email or convenient demo bypass
    if (
      (normalizedEmail === 'admin@obsidian.studio' && password === 'obsidian2026') ||
      (normalizedEmail === 'aakashgaurav456@gmail.com' && password.length >= 4) ||
      (normalizedEmail === 'demo@obsidian.studio' && password === 'demo')
    ) {
      const user: User = {
        ...this.defaultAdmin,
        email: normalizedEmail,
        name: normalizedEmail.includes('aakash') ? SITE_CONFIG.persona.name : 'Studio Administrator'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid credentials. Use demo credentials or admin email.');
  }

  logout(): void {
    if (auth) {
      signOut(auth).catch((e) => console.error('Sign-out failed', e));
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
