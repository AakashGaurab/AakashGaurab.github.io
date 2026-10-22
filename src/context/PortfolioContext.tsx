import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Project, ContactMessage, StudioTelemetry, SkillCategory, SkillItem, PersonaConfig, ThemeConfig, ExperienceItem } from '../types';
import { IPortfolioService, portfolioService } from '../services/portfolioService';
import { THEME_PRESETS } from '../data/initialData';
import { notifySlack } from '../services/slackService';
import { SITE_CONFIG } from '../config/site.config';

interface PortfolioContextType {
  projects: Project[];
  filteredProjects: Project[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  addProject: (data: Omit<Project, 'id'>) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  toggleFeatured: (id: string) => void;
  messages: ContactMessage[];
  sendMessage: (name: string, email: string, subject: string, message: string) => Promise<boolean>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;
  telemetry: StudioTelemetry;
  updateTelemetryStatus: (status: StudioTelemetry['systemStatus']) => void;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  visibleSkills: SkillCategory[];
  visibleNav: (typeof SITE_CONFIG.nav)[number][];
  updateExperience: (items: ExperienceItem[]) => void;
  updateSkills: (categories: SkillCategory[]) => void;
  addSkill: (categoryId: string, skill: { name: string; level: string; focus: string }) => SkillItem;
  deleteSkill: (categoryId: string, skillId: string) => void;
  persona: PersonaConfig;
  updatePersona: (newPersona: PersonaConfig) => void;
  theme: ThemeConfig;
  updateTheme: (newTheme: ThemeConfig) => void;
  applyThemePreset: (presetName: string) => void;
  resetTheme: () => void;
  themePresets: ThemeConfig[];
  refreshData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({
  children,
  service = portfolioService
}: {
  children: ReactNode;
  service?: IPortfolioService;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [telemetry, setTelemetry] = useState<StudioTelemetry>(service.getTelemetry());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [persona, setPersona] = useState<PersonaConfig>(service.getPersona());
  const [theme, setTheme] = useState<ThemeConfig>(service.getTheme());

  const applyCssVariables = (t: ThemeConfig) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', t.primaryColor);
      root.style.setProperty('--color-secondary', t.secondaryColor);
      root.style.setProperty('--color-bg', t.backgroundColor);
      root.style.setProperty('--color-surface', t.surfaceColor);
      root.style.setProperty('--color-surface-container', t.surfaceContainer);
      root.style.setProperty('--color-border', t.borderColor);
      root.style.setProperty('--primary-glow', t.primaryGlow);
    }
  };

  const loadData = () => {
    setProjects(service.getProjects());
    setMessages(service.getMessages());
    setTelemetry(service.getTelemetry());
    setSkills(service.getSkills());
    setExperience(service.getExperience());
    const currentPersona = service.getPersona();
    setPersona(currentPersona);
    const currentTheme = service.getTheme();
    setTheme(currentTheme);
    applyCssVariables(currentTheme);
  };

  useEffect(() => {
    loadData();
  }, [service]);

  useEffect(() => {
    applyCssVariables(theme);
  }, [theme]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Public sections (and skill domains) with no content are hidden, along with their nav links.
  const visibleSkills = useMemo(() => skills.filter((cat) => cat.skills.length > 0), [skills]);
  const visibleNav = useMemo(() => {
    const isEmpty: Record<string, boolean> = {
      projects: projects.length === 0,
      expertise: visibleSkills.length === 0,
      experience: experience.length === 0
    };
    return SITE_CONFIG.nav.filter((item) => !isEmpty[item.sectionId]);
  }, [projects, visibleSkills, experience]);

  const addProject = (data: Omit<Project, 'id'>) => {
    const created = service.saveProject(data);
    setProjects(service.getProjects());
    return created;
  };

  const updateProject = (project: Project) => {
    service.saveProject(project);
    setProjects(service.getProjects());
    if (selectedProject?.id === project.id) {
      setSelectedProject(project);
    }
  };

  const deleteProject = (id: string) => {
    service.deleteProject(id);
    setProjects(service.getProjects());
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const toggleFeatured = (id: string) => {
    service.toggleFeatured(id);
    setProjects(service.getProjects());
  };

  const sendMessage = async (
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> => {
    // Slack is the delivery channel; a network failure rejects and the form shows its error.
    await notifySlack({ name, email, subject, message });
    service.addMessage(name, email, subject, message);
    setMessages(service.getMessages());
    return true;
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status']) => {
    service.updateMessageStatus(id, status);
    setMessages(service.getMessages());
  };

  const deleteMessage = (id: string) => {
    service.deleteMessage(id);
    setMessages(service.getMessages());
  };

  const updateTelemetryStatus = (status: StudioTelemetry['systemStatus']) => {
    const updated = service.updateTelemetryStatus(status);
    setTelemetry(updated);
  };

  const updateSkills = (categories: SkillCategory[]) => {
    service.saveSkills(categories);
    setSkills(service.getSkills());
  };

  const addSkill = (categoryId: string, skill: { name: string; level: string; focus: string }) => {
    const created = service.addSkill(categoryId, skill);
    setSkills(service.getSkills());
    return created;
  };

  const deleteSkill = (categoryId: string, skillId: string) => {
    service.deleteSkill(categoryId, skillId);
    setSkills(service.getSkills());
  };

  const updateExperience = (items: ExperienceItem[]) => {
    service.saveExperience(items);
    setExperience(service.getExperience());
  };

  const updatePersona = (newPersona: PersonaConfig) => {
    service.savePersona(newPersona);
    setPersona(newPersona);
  };

  const updateTheme = (newTheme: ThemeConfig) => {
    service.saveTheme(newTheme);
    setTheme(newTheme);
    applyCssVariables(newTheme);
  };

  const applyThemePreset = (presetName: string) => {
    const found = THEME_PRESETS.find((p) => p.presetName === presetName);
    if (found) {
      updateTheme(found);
    }
  };

  const resetTheme = () => {
    const def = service.resetTheme();
    setTheme(def);
    applyCssVariables(def);
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        filteredProjects,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProject,
        setSelectedProject,
        addProject,
        updateProject,
        deleteProject,
        toggleFeatured,
        messages,
        sendMessage,
        updateMessageStatus,
        deleteMessage,
        telemetry,
        updateTelemetryStatus,
        skills,
        experience,
        visibleSkills,
        visibleNav,
        updateExperience,
        updateSkills,
        addSkill,
        deleteSkill,
        persona,
        updatePersona,
        theme,
        updateTheme,
        applyThemePreset,
        resetTheme,
        themePresets: THEME_PRESETS,
        refreshData: loadData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
