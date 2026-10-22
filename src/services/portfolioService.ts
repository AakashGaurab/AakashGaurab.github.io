import { Project, ContactMessage, StudioTelemetry, SkillCategory, SkillItem, PersonaConfig, ThemeConfig, ExperienceItem } from '../types';
import { INITIAL_PROJECTS, INITIAL_MESSAGES, INITIAL_TELEMETRY, SKILL_CATEGORIES, INITIAL_PERSONA, INITIAL_THEME, INITIAL_EXPERIENCE } from '../data/initialData';
import { db, auth, isFirebaseEnabled } from './firebase';
import { doc, getDoc, setDoc, deleteField } from 'firebase/firestore/lite';

export interface IPortfolioService {
  getProjects(): Project[];
  getProjectById(id: string): Project | undefined;
  saveProject(project: Omit<Project, 'id'> & { id?: string }): Project;
  deleteProject(id: string): boolean;
  toggleFeatured(id: string): Project | undefined;
  getMessages(): ContactMessage[];
  addMessage(name: string, email: string, subject: string, message: string): ContactMessage;
  updateMessageStatus(id: string, status: ContactMessage['status']): void;
  deleteMessage(id: string): boolean;
  getTelemetry(): StudioTelemetry;
  updateTelemetryStatus(status: StudioTelemetry['systemStatus']): StudioTelemetry;
  getSkills(): SkillCategory[];
  saveSkills(categories: SkillCategory[]): void;
  getExperience(): ExperienceItem[];
  saveExperience(items: ExperienceItem[]): void;
  addSkill(categoryId: string, skill: { name: string; level: string; focus: string }): SkillItem;
  deleteSkill(categoryId: string, skillId: string): boolean;
  getPersona(): PersonaConfig;
  savePersona(persona: PersonaConfig): void;
  getTheme(): ThemeConfig;
  saveTheme(theme: ThemeConfig): void;
  resetTheme(): ThemeConfig;
}

const PROJECTS_STORAGE_KEY = 'obsidian_studio_projects_v1';
const MESSAGES_STORAGE_KEY = 'obsidian_studio_messages_v1';
const TELEMETRY_STORAGE_KEY = 'obsidian_studio_telemetry_v1';
const SKILLS_STORAGE_KEY = 'obsidian_studio_skills_v1';
const PERSONA_STORAGE_KEY = 'obsidian_studio_persona_v1';
const THEME_STORAGE_KEY = 'obsidian_studio_theme_v1';
const EXPERIENCE_STORAGE_KEY = 'obsidian_studio_experience_v1';
const DEFAULTS_FINGERPRINT_KEY = 'obsidian_studio_defaults_fingerprint';

// When the bundled defaults (site.config.ts / initialData.ts) change, drop the
// browser-cached copies so the new config shows up. Messages are visitor data and are kept.
function syncStoredDefaults(): void {
  const json = JSON.stringify([INITIAL_PROJECTS, SKILL_CATEGORIES, INITIAL_PERSONA, INITIAL_THEME, INITIAL_EXPERIENCE]);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) | 0;
  }
  const fingerprint = String(hash);
  try {
    if (localStorage.getItem(DEFAULTS_FINGERPRINT_KEY) !== fingerprint) {
      [PROJECTS_STORAGE_KEY, SKILLS_STORAGE_KEY, PERSONA_STORAGE_KEY, THEME_STORAGE_KEY, EXPERIENCE_STORAGE_KEY].forEach((key) =>
        localStorage.removeItem(key)
      );
      localStorage.setItem(DEFAULTS_FINGERPRINT_KEY, fingerprint);
    }
  } catch {
    // Storage unavailable: the service falls back to the bundled defaults.
  }
}

syncStoredDefaults();

// Site content (projects, skills, persona, theme, experience) as one Firestore document,
// one field per entity. Messages and telemetry stay in localStorage.
const CONTENT_DOC_PATH = ['site', 'content'] as const;
const CONTENT_FIELDS: Record<string, string> = {
  [PROJECTS_STORAGE_KEY]: 'projects',
  [SKILLS_STORAGE_KEY]: 'skills',
  [PERSONA_STORAGE_KEY]: 'persona',
  [THEME_STORAGE_KEY]: 'theme',
  [EXPERIENCE_STORAGE_KEY]: 'experience'
};
const CONTENT_LOAD_TIMEOUT_MS = 8000;

type ContentStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// In-memory copy of the Firestore document, keyed like localStorage so the getters
// below read it the same way (fresh JSON.parse per read). Writes go back to Firestore
// only for the signed-in admin and only after a successful load, so a failed or slow
// fetch can never overwrite live content with the bundled defaults.
class FirestoreContentStorage implements ContentStorage {
  private cache = new Map<string, string>();
  private loaded = false;

  async load(): Promise<void> {
    if (!db) return;
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timed out loading site content')), CONTENT_LOAD_TIMEOUT_MS)
    );
    try {
      const snapshot = await Promise.race([getDoc(doc(db, ...CONTENT_DOC_PATH)), timeout]);
      const data = snapshot.data() ?? {};
      Object.entries(CONTENT_FIELDS).forEach(([key, field]) => {
        if (data[field] !== undefined) this.cache.set(key, JSON.stringify(data[field]));
      });
      this.loaded = true;
    } catch (e) {
      // Render with the bundled defaults; admin saves stay disabled for this session.
      console.error('Firestore content load failed', e);
    }
  }

  getItem(key: string): string | null {
    return this.cache.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.cache.set(key, value);
    this.write(key, JSON.parse(value));
  }

  removeItem(key: string): void {
    this.cache.delete(key);
    this.write(key, deleteField());
  }

  private write(key: string, value: unknown): void {
    if (!db || !this.loaded || !auth?.currentUser) return;
    setDoc(doc(db, ...CONTENT_DOC_PATH), { [CONTENT_FIELDS[key]]: value }, { merge: true }).catch((e) => {
      console.error('Firestore save failed', e);
      window.alert('Saving to Firestore failed. Your change is not live; check the console for details.');
    });
  }
}

const firestoreContent = isFirebaseEnabled ? new FirestoreContentStorage() : null;

// localStorage is only touched on use: the bare global throws where storage is blocked.
export const contentStorage: ContentStorage = firestoreContent ?? {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key)
};

// Fetches the site content from Firestore. main.tsx awaits this before the first render.
export function loadSiteContent(): Promise<void> {
  return firestoreContent?.load() ?? Promise.resolve();
}

class PortfolioService implements IPortfolioService {
  getProjects(): Project[] {
    try {
      const stored = contentStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // Initialize default
    this.saveProjectsToStorage(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  private saveProjectsToStorage(projects: Project[]): void {
    try {
      contentStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  saveProject(projectData: Omit<Project, 'id'> & { id?: string }): Project {
    const projects = this.getProjects();
    if (projectData.id) {
      // Update
      const index = projects.findIndex((p) => p.id === projectData.id);
      if (index !== -1) {
        const updated = { ...projects[index], ...projectData } as Project;
        projects[index] = updated;
        this.saveProjectsToStorage(projects);
        return updated;
      }
    }

    // Create new
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`
    };
    const updatedList = [newProject, ...projects];
    this.saveProjectsToStorage(updatedList);
    return newProject;
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length !== projects.length) {
      this.saveProjectsToStorage(filtered);
      return true;
    }
    return false;
  }

  toggleFeatured(id: string): Project | undefined {
    const projects = this.getProjects();
    const target = projects.find((p) => p.id === id);
    if (target) {
      target.featured = !target.featured;
      this.saveProjectsToStorage([...projects]);
      return target;
    }
    return undefined;
  }

  getMessages(): ContactMessage[] {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.saveMessagesToStorage(INITIAL_MESSAGES);
    return INITIAL_MESSAGES;
  }

  private saveMessagesToStorage(messages: ContactMessage[]): void {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  addMessage(name: string, email: string, subject: string, message: string): ContactMessage {
    const messages = this.getMessages();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: formattedDate,
      status: 'unread'
    };

    const updated = [newMsg, ...messages];
    this.saveMessagesToStorage(updated);
    return newMsg;
  }

  updateMessageStatus(id: string, status: ContactMessage['status']): void {
    const messages = this.getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages[index].status = status;
      this.saveMessagesToStorage([...messages]);
    }
  }

  deleteMessage(id: string): boolean {
    const messages = this.getMessages();
    const filtered = messages.filter((m) => m.id !== id);
    if (filtered.length !== messages.length) {
      this.saveMessagesToStorage(filtered);
      return true;
    }
    return false;
  }

  getTelemetry(): StudioTelemetry {
    try {
      const stored = localStorage.getItem(TELEMETRY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_TELEMETRY;
  }

  updateTelemetryStatus(status: StudioTelemetry['systemStatus']): StudioTelemetry {
    const current = this.getTelemetry();
    const updated = { ...current, systemStatus: status };
    try {
      localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage error', e);
    }
    return updated;
  }

  getSkills(): SkillCategory[] {
    try {
      const stored = contentStorage.getItem(SKILLS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.saveSkills(SKILL_CATEGORIES);
    return SKILL_CATEGORIES;
  }

  saveSkills(categories: SkillCategory[]): void {
    try {
      contentStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  getExperience(): ExperienceItem[] {
    try {
      const stored = contentStorage.getItem(EXPERIENCE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Use the bundled portfolio defaults when stored data is unavailable.
    }
    return INITIAL_EXPERIENCE;
  }

  saveExperience(items: ExperienceItem[]): void {
    try {
      contentStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  addSkill(categoryId: string, skill: { name: string; level: string; focus: string }): SkillItem {
    const categories = this.getSkills();
    const targetCat = categories.find((c) => c.id === categoryId);
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: skill.name,
      level: skill.level,
      focus: skill.focus,
      category: categoryId
    };

    if (targetCat) {
      targetCat.skills.push(newSkill);
    } else if (categories.length > 0) {
      categories[0].skills.push(newSkill);
    }
    this.saveSkills(categories);
    return newSkill;
  }

  deleteSkill(categoryId: string, skillId: string): boolean {
    const categories = this.getSkills();
    const targetCat = categories.find((c) => c.id === categoryId);
    if (targetCat) {
      const initialLen = targetCat.skills.length;
      targetCat.skills = targetCat.skills.filter((s) => s.id !== skillId);
      if (targetCat.skills.length !== initialLen) {
        this.saveSkills(categories);
        return true;
      }
    }
    return false;
  }

  getPersona(): PersonaConfig {
    try {
      const stored = contentStorage.getItem(PERSONA_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.savePersona(INITIAL_PERSONA);
    return INITIAL_PERSONA;
  }

  savePersona(persona: PersonaConfig): void {
    try {
      contentStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(persona));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  getTheme(): ThemeConfig {
    try {
      const stored = contentStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.saveTheme(INITIAL_THEME);
    return INITIAL_THEME;
  }

  saveTheme(theme: ThemeConfig): void {
    try {
      contentStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  resetTheme(): ThemeConfig {
    this.saveTheme(INITIAL_THEME);
    return INITIAL_THEME;
  }
}

export const portfolioService = new PortfolioService();
