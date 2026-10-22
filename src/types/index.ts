import type { PROJECT_CATEGORIES } from '../config/site.config';

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  coverImage: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics: string;
  year: string;
  role: string;
  client?: string;
  highlights?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guest';
  avatar?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  technologies: string[];
  highlight: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: string;
  focus: string;
  category: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  skills: SkillItem[];
}

export interface PersonaConfig {
  name: string;
  roleTitle: string;
  headline: string;
  leadTagline: string;
  bio: string;
  availabilityText: string;
  isAvailable: boolean;
  location: string;
  heroImage: string;
  studioThroughput: string;
  metricLatency: string;
  metricSLA: string;
  metricTeams: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface ThemeConfig {
  presetName: string;
  primaryColor: string;       // default #8b5cf6
  primaryGlow: string;        // default rgba(139, 92, 246, 0.45)
  secondaryColor: string;     // default #84cc16
  backgroundColor: string;    // default #09090b
  surfaceColor: string;       // default #13141f
  surfaceContainer: string;   // default #1e1f2e
  borderColor: string;        // default #27273a
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'archived';
}

export interface StudioTelemetry {
  activeDeployments: number;
  uptimePercent: number;
  totalProjects: number;
  clientSatisfaction: number;
  systemStatus: 'Optimal' | 'Maintenance' | 'Deploying';
  latencyMs: number;
}
