import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useRouter, Link } from '../context/RouterContext';
import { Project, SkillItem, SkillCategory, PersonaConfig, ThemeConfig, ExperienceItem } from '../types';
import { PROJECT_CATEGORIES } from '../config/site.config';
import { contentStorage } from '../services/portfolioService';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Star,
  Mail,
  Activity,
  CheckCircle2,
  ExternalLink,
  Shield,
  LogOut,
  X,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Save,
  Palette,
  User,
  Cpu,
  Image as ImageIcon,
  Sliders,
  RefreshCw,
  Eye,
  Milestone,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function AdminPage() {
  const { user, logout } = useAuth();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    messages,
    updateMessageStatus,
    deleteMessage,
    telemetry,
    updateTelemetryStatus,
    skills,
    updateSkills,
    experience,
    updateExperience,
    addSkill,
    deleteSkill,
    persona,
    updatePersona,
    theme,
    updateTheme,
    applyThemePreset,
    resetTheme,
    themePresets,
    refreshData
  } = usePortfolio();
  const { navigate } = useRouter();

  type AdminTab = 'projects' | 'skills' | 'experience' | 'persona' | 'theme' | 'messages' | 'telemetry';
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [projectSearch, setProjectSearch] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // ----------------------------------------------------
  // Project Modal State (Add or Edit)
  // ----------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<Project['category']>(PROJECT_CATEGORIES[0]);
  const [formTags, setFormTags] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formDemoUrl, setFormDemoUrl] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formMetrics, setFormMetrics] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formRole, setFormRole] = useState('Lead Architect');
  const [formClient, setFormClient] = useState('');
  const [formHighlights, setFormHighlights] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  const openNewProjectModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormSlug('');
    setFormTagline('');
    setFormDescription('');
    setFormCategory(PROJECT_CATEGORIES[0]);
    setFormTags('TypeScript, React 19, Tailwind');
    setFormCoverImage('/images/project_quantum_flow_1791460364535.jpg');
    setFormDemoUrl('https://example.com/demo');
    setFormGithubUrl('https://github.com/obsidian-studio');
    setFormMetrics('< 1.0ms Latency');
    setFormYear('2026');
    setFormRole('Lead Engineer');
    setFormClient('Aether Systems');
    setFormHighlights('Implemented zero-latency state synchronization pipeline.\nAchieved steady 60 FPS viewport rendering.');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormSlug(proj.slug);
    setFormTagline(proj.tagline);
    setFormDescription(proj.description);
    setFormCategory(proj.category);
    setFormTags(proj.tags.join(', '));
    setFormCoverImage(proj.coverImage);
    setFormDemoUrl(proj.demoUrl || '');
    setFormGithubUrl(proj.githubUrl || '');
    setFormMetrics(proj.metrics);
    setFormYear(proj.year);
    setFormRole(proj.role);
    setFormClient(proj.client || '');
    setFormHighlights((proj.highlights || []).join('\n'));
    setFormFeatured(proj.featured);
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedHighlights = formHighlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const projectPayload = {
      title: formTitle.trim(),
      slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      category: formCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['TypeScript'],
      coverImage: formCoverImage.trim() || '/images/project_quantum_flow_1791460364535.jpg',
      demoUrl: formDemoUrl.trim() || undefined,
      githubUrl: formGithubUrl.trim() || undefined,
      featured: formFeatured,
      metrics: formMetrics.trim() || 'Production Grade',
      year: formYear.trim() || '2026',
      role: formRole.trim() || 'Lead Architect',
      client: formClient.trim() || undefined,
      highlights: parsedHighlights
    };

    if (editingProject) {
      updateProject({ ...projectPayload, id: editingProject.id });
      showToast(`Updated "${formTitle}" successfully.`);
    } else {
      addProject(projectPayload);
      showToast(`Added new project "${formTitle}".`);
    }

    setIsModalOpen(false);
  };

  // ----------------------------------------------------
  // Skills Management State
  // ----------------------------------------------------
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillCategorySelect, setSkillCategorySelect] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Mastery');
  const [skillFocus, setSkillFocus] = useState('');

  const openSkillModal = (categoryId = skills[0]?.id ?? '') => {
    setSkillCategorySelect(categoryId);
    setIsSkillModalOpen(true);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    addSkill(skillCategorySelect, {
      name: skillName.trim(),
      level: skillLevel,
      focus: skillFocus.trim() || 'High-performance production implementation'
    });

    showToast(`Added skill "${skillName}" to capabilities.`);
    setSkillName('');
    setSkillFocus('');
    setIsSkillModalOpen(false);
  };

  // ----------------------------------------------------
  // Skill Domains (categories) State
  // ----------------------------------------------------
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [domainTitle, setDomainTitle] = useState('');
  const [domainSubtitle, setDomainSubtitle] = useState('');

  const openDomainModal = (domain?: SkillCategory) => {
    setEditingDomainId(domain?.id ?? null);
    setDomainTitle(domain?.title ?? '');
    setDomainSubtitle(domain?.subtitle ?? '');
    setIsDomainModalOpen(true);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const title = domainTitle.trim();
    if (!title) return;
    const subtitle = domainSubtitle.trim();

    if (editingDomainId) {
      updateSkills(skills.map((c) => (c.id === editingDomainId ? { ...c, title, subtitle } : c)));
      showToast(`Updated domain "${title}".`);
    } else {
      updateSkills([...skills, { id: `cat-${Date.now()}`, title, subtitle, skills: [] }]);
      showToast(`Added domain "${title}".`);
    }
    setIsDomainModalOpen(false);
  };

  const handleDeleteDomain = (domain: SkillCategory) => {
    const skillNote = domain.skills.length > 0 ? ` and its ${domain.skills.length} skill(s)` : '';
    if (window.confirm(`Delete domain "${domain.title}"${skillNote}?`)) {
      updateSkills(skills.filter((c) => c.id !== domain.id));
      showToast(`Deleted domain "${domain.title}".`);
    }
  };

  const moveDomain = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;
    const reordered = [...skills];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updateSkills(reordered);
  };

  // ----------------------------------------------------
  // Engineering History (Experience) State
  // ----------------------------------------------------
  const emptyExperienceForm: Omit<ExperienceItem, 'id'> = {
    role: '',
    company: '',
    location: '',
    period: '',
    description: '',
    technologies: [],
    highlight: ''
  };
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceForm, setExperienceForm] = useState<Omit<ExperienceItem, 'id'>>(emptyExperienceForm);
  const [experienceTech, setExperienceTech] = useState('');

  const openNewExperienceModal = () => {
    setEditingExperienceId(null);
    setExperienceForm(emptyExperienceForm);
    setExperienceTech('');
    setIsExperienceModalOpen(true);
  };

  const openEditExperienceModal = (item: ExperienceItem) => {
    const { id, ...rest } = item;
    setEditingExperienceId(id);
    setExperienceForm(rest);
    setExperienceTech(item.technologies.join(', '));
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.role.trim() || !experienceForm.company.trim()) return;

    const payload = {
      role: experienceForm.role.trim(),
      company: experienceForm.company.trim(),
      location: experienceForm.location.trim(),
      period: experienceForm.period.trim(),
      description: experienceForm.description.trim(),
      highlight: experienceForm.highlight.trim(),
      technologies: experienceTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };

    if (editingExperienceId) {
      updateExperience(experience.map((x) => (x.id === editingExperienceId ? { ...payload, id: x.id } : x)));
      showToast(`Updated "${payload.role}" at ${payload.company}.`);
    } else {
      // New roles go to the top: the timeline is shown most recent first.
      updateExperience([{ ...payload, id: `exp-${Date.now()}` }, ...experience]);
      showToast(`Added "${payload.role}" to engineering history.`);
    }

    setIsExperienceModalOpen(false);
  };

  const moveExperience = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= experience.length) return;
    const reordered = [...experience];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updateExperience(reordered);
  };

  // ----------------------------------------------------
  // Visual Persona State
  // ----------------------------------------------------
  const [personaForm, setPersonaForm] = useState<PersonaConfig>(persona);

  const handleSavePersona = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersona(personaForm);
    showToast('Visual persona updated across public portfolio!');
  };

  const sampleStudioImages = [
    { label: 'Developer Workstation', path: '/images/hero_creative_developer_1791460352002.jpg' },
    { label: 'Quantum Node Flow', path: '/images/project_quantum_flow_1791460364535.jpg' },
    { label: 'Hyperion Audio Lab', path: '/images/project_hyperion_synth_1791460375570.jpg' },
    { label: 'Neural Token Studio', path: '/images/project_neural_canvas_1791460386996.jpg' }
  ];

  // ----------------------------------------------------
  // Color Settings State
  // ----------------------------------------------------
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(theme);

  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    const updated = { ...customTheme, [key]: val };
    setCustomTheme(updated);
    updateTheme(updated);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[#f4f4f5] pb-24">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-secondary)]/50 shadow-2xl flex items-center gap-2.5 text-xs text-[#f4f4f5] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Admin Subheader Banner */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-container)] border border-[var(--color-primary)]/40 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-white">Studio Admin Console</h1>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-secondary)]">
                  Authorized
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Studio Identity: <strong className="text-[#e2e0fa]">{persona.name}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3.5 py-1.5 text-xs font-medium text-[#e2e0fa] bg-[var(--color-surface-container)] hover:bg-[#28283b] border border-[var(--color-border)] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>View Public Portfolio</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-[#ffb4ab] bg-[#2b161b] hover:bg-[#3b1c24] border border-[#ffb4ab]/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-1">
              <span>Total Artifacts</span>
              <Layers className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {projects.length}
            </div>
            <span className="text-[11px] text-[var(--color-secondary)]">
              {projects.filter((p) => p.featured).length} Featured In Bento
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-1">
              <span>Client Inquiries</span>
              <Mail className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {messages.length}
            </div>
            <span className="text-[11px] text-[#d0bcff]">
              {unreadMessagesCount} unread incoming
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-1">
              <span>Skills Catalog</span>
              <Cpu className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
            </div>
            <span className="text-[11px] text-[var(--color-secondary)]">
              Across {skills.length} domains
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[#71717a] mb-1">
              <span>Studio Theme</span>
              <Palette className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div className="text-base font-bold font-display text-white truncate">
              {theme.presetName}
            </div>
            <span className="text-[11px] font-mono text-[#71717a]">
              Primary {theme.primaryColor}
            </span>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6 gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'skills'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Skills & Capabilities</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'experience'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Milestone className="w-3.5 h-3.5" />
              <span>Engineering History ({experience.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('persona')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'persona'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Visual Persona</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'theme'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inquiries</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--color-secondary)] text-[var(--color-bg)] font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'telemetry'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Ops</span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={openNewProjectModal}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          )}

          {activeTab === 'skills' && (
            <button
              onClick={() => openDomainModal()}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Domain</span>
            </button>
          )}

          {activeTab === 'experience' && (
            <button
              onClick={openNewExperienceModal}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: Projects Management */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Filter admin project list..."
                className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-bg)] text-[#a1a1aa] border-b border-[var(--color-border)] uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Exhibit</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Performance Metric</th>
                      <th className="py-3.5 px-4">Year</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--color-surface-container)] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.coverImage}
                              alt={p.title}
                              className="w-12 h-9 object-cover rounded-md border border-[var(--color-border)]"
                            />
                            <div>
                              <span className="font-bold text-white block">{p.title}</span>
                              <span className="text-[11px] text-[#71717a] truncate max-w-xs block">
                                {p.tagline}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[#d0bcff]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[var(--color-secondary)]">
                          {p.metrics}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#71717a]">
                          {p.year}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleFeatured(p.id)}
                            title={p.featured ? 'Unfeature' : 'Feature in Bento'}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              p.featured
                                ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[#d0bcff]'
                                : 'bg-[var(--color-surface-container)] border-[var(--color-border)] text-[#71717a] hover:text-white'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditProjectModal(p)}
                              title="Edit Project"
                              className="p-1.5 rounded-lg bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${p.title}"?`)) {
                                  deleteProject(p.id);
                                  showToast(`Deleted "${p.title}".`);
                                }
                              }}
                              title="Delete Project"
                              className="p-1.5 rounded-lg bg-[#2b161b] hover:bg-[#3b1c24] text-[#ffb4ab] border border-[#ffb4ab]/30 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: Skills & Capabilities Addition */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div>
                <h3 className="text-sm font-bold text-white">Frontend & System Engineering Disciplines</h3>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  Manage technical proficiencies, frameworks, and tools displayed on the public capabilities grid.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openDomainModal()}
                  className="px-4 py-2 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Domain</span>
                </button>
                {skills.length > 0 && (
                  <button
                    onClick={() => openSkillModal()}
                    className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Skill</span>
                  </button>
                )}
              </div>
            </div>

            {skills.length === 0 && (
              <p className="text-xs text-[#71717a] italic p-6 text-center">
                No domains yet. Add a domain, then add skills to it.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((category, index) => (
                <div
                  key={category.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="pb-3 border-b border-[var(--color-border)] mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-[var(--color-primary)] uppercase">Domain Category</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveDomain(index, -1)}
                            disabled={index === 0}
                            title="Move Earlier"
                            className="p-1 rounded text-[#71717a] hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveDomain(index, 1)}
                            disabled={index === skills.length - 1}
                            title="Move Later"
                            className="p-1 rounded text-[#71717a] hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDomainModal(category)}
                            title="Edit Domain"
                            className="p-1 rounded text-[#71717a] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDomain(category)}
                            title="Delete Domain"
                            className="p-1 rounded text-[#71717a] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">{category.title}</h4>
                      <p className="text-xs text-[#a1a1aa]">{category.subtitle}</p>
                    </div>

                    <div className="space-y-3">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] group hover:border-[var(--color-border-strong)] transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-white text-xs">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-[var(--color-secondary)] px-1.5 py-0.5 rounded bg-[var(--color-surface-container)] border border-[var(--color-border)]">
                                {skill.level}
                              </span>
                              <button
                                onClick={() => {
                                  deleteSkill(category.id, skill.id);
                                  showToast(`Removed skill "${skill.name}".`);
                                }}
                                title="Remove Skill"
                                className="text-[#71717a] hover:text-[#ffb4ab] transition-colors p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#71717a]">{skill.focus}</p>
                        </div>
                      ))}

                      {category.skills.length === 0 && (
                        <p className="text-xs text-[#71717a] italic p-4 text-center">No skills in this domain yet (hidden on the public site).</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-right">
                    <button
                      onClick={() => openSkillModal(category.id)}
                      className="text-xs text-[var(--color-primary)] hover:text-[#d0bcff] font-medium"
                    >
                      + Add to {category.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: Engineering History (Experience Timeline) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h3 className="text-sm font-bold text-white">Engineering History Timeline</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Roles shown in the public experience timeline, in the order listed here (most recent first).
              </p>
            </div>

            {experience.map((item, index) => (
              <div
                key={item.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-border-strong)] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-white">{item.role}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono mt-0.5">
                      <span className="text-[var(--color-primary)] font-semibold">{item.company}</span>
                      {item.location && <span className="text-[#a1a1aa]">· {item.location}</span>}
                      {item.period && (
                        <span className="text-[var(--color-secondary)] px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-border)]">
                          {item.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#cbc3d7] mt-2 line-clamp-2">{item.description}</p>
                    {item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[11px] font-mono text-[#cbc3d7]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => moveExperience(index, -1)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveExperience(index, 1)}
                      disabled={index === experience.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditExperienceModal(item)}
                      title="Edit Role"
                      className="p-1.5 rounded-lg bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${item.role}" at ${item.company}?`)) {
                          updateExperience(experience.filter((x) => x.id !== item.id));
                          showToast(`Deleted "${item.role}".`);
                        }
                      }}
                      title="Delete Role"
                      className="p-1.5 rounded-lg bg-[#2b161b] hover:bg-[#3b1c24] text-[#ffb4ab] border border-[#ffb4ab]/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {experience.length === 0 && (
              <p className="text-xs text-[#71717a] italic p-6 text-center">No roles yet. Add one to start the timeline.</p>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: Visual Persona Changes */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'persona' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h3 className="text-sm font-bold text-white">Visual Persona & Headline Narrative</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Customize your professional identity, hero titles, availability broadcast, and claim-to-proof metrics.
              </p>
            </div>

            <form onSubmit={handleSavePersona} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Core Narrative */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[var(--color-primary)]">
                    Core Identity & Headings
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Lead Identity / Technologist Name
                    </label>
                    <input
                      type="text"
                      required
                      value={personaForm.name}
                      onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Role Title (Shown in Status Badge)
                    </label>
                    <input
                      type="text"
                      required
                      value={personaForm.roleTitle}
                      onChange={(e) => setPersonaForm({ ...personaForm, roleTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Display Headline (Large Hero Title)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={personaForm.headline}
                      onChange={(e) => setPersonaForm({ ...personaForm, headline: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Hero Subtitle / Narrative
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={personaForm.leadTagline}
                      onChange={(e) => setPersonaForm({ ...personaForm, leadTagline: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                        Availability Text
                      </label>
                      <input
                        type="text"
                        value={personaForm.availabilityText}
                        onChange={(e) => setPersonaForm({ ...personaForm, availabilityText: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                        Studio Location
                      </label>
                      <input
                        type="text"
                        value={personaForm.location}
                        onChange={(e) => setPersonaForm({ ...personaForm, location: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white focus:border-[var(--color-primary)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="availToggle"
                      checked={personaForm.isAvailable}
                      onChange={(e) => setPersonaForm({ ...personaForm, isAvailable: e.target.checked })}
                      className="rounded border-[var(--color-border)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                    />
                    <label htmlFor="availToggle" className="text-xs text-white cursor-pointer select-none">
                      Active Availability Signal (Pulsing Green Beacon)
                    </label>
                  </div>
                </div>

                {/* Imagery & Proof Metrics */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[var(--color-primary)]">
                    Imagery & Proof Metrics
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Hero Studio Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={personaForm.heroImage}
                      onChange={(e) => setPersonaForm({ ...personaForm, heroImage: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white font-mono focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>

                  {/* Preset Image Chooser */}
                  <div>
                    <span className="block text-[11px] text-[#71717a] mb-1.5">Or Choose Generated Studio Shot:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleStudioImages.map((img) => (
                        <button
                          key={img.path}
                          type="button"
                          onClick={() => setPersonaForm({ ...personaForm, heroImage: img.path })}
                          className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            personaForm.heroImage === img.path
                              ? 'border-[var(--color-primary)] bg-[var(--color-surface-container)]'
                              : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border-strong)]'
                          }`}
                        >
                          <img src={img.path} alt={img.label} className="w-9 h-7 object-cover rounded" />
                          <span className="text-[11px] text-white truncate">{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <span className="block text-xs font-medium text-[#cbc3d7] mb-2">Claim-to-Proof Metrics:</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#71717a] mb-1">Latency Profile</label>
                        <input
                          type="text"
                          value={personaForm.metricLatency}
                          onChange={(e) => setPersonaForm({ ...personaForm, metricLatency: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-secondary)] font-mono focus:border-[var(--color-primary)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#71717a] mb-1">Runtime SLA</label>
                        <input
                          type="text"
                          value={personaForm.metricSLA}
                          onChange={(e) => setPersonaForm({ ...personaForm, metricSLA: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white font-mono focus:border-[var(--color-primary)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#71717a] mb-1">Engaged Teams</label>
                        <input
                          type="text"
                          value={personaForm.metricTeams}
                          onChange={(e) => setPersonaForm({ ...personaForm, metricTeams: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[#d0bcff] font-mono focus:border-[var(--color-primary)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#71717a] mb-1">Studio Ingress Throughput</label>
                        <input
                          type="text"
                          value={personaForm.studioThroughput}
                          onChange={(e) => setPersonaForm({ ...personaForm, studioThroughput: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-secondary)] font-mono focus:border-[var(--color-primary)] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1">
                      Direct Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={personaForm.contactEmail}
                      onChange={(e) => setPersonaForm({ ...personaForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white font-mono focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#cbc3d7] mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={personaForm.githubUrl}
                        onChange={(e) => setPersonaForm({ ...personaForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white font-mono focus:border-[var(--color-primary)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#cbc3d7] mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={personaForm.linkedinUrl}
                        onChange={(e) => setPersonaForm({ ...personaForm, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-white font-mono focus:border-[var(--color-primary)] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Persona & Update Portfolio</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: Color Settings & Theme Studio */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h3 className="text-sm font-bold text-white">Studio Palette & Color Tokens</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Instant theme controls. Choose curated obsidian aesthetic presets or tailor precise hex shades.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
              <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider block mb-3">
                Curated Theme Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {themePresets.map((preset) => {
                  const isActive = theme.presetName === preset.presetName;
                  return (
                    <button
                      key={preset.presetName}
                      type="button"
                      onClick={() => {
                        applyThemePreset(preset.presetName);
                        setCustomTheme(preset);
                        showToast(`Activated "${preset.presetName}" palette.`);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface-container)] shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.primaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.secondaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.backgroundColor }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white block truncate">{preset.presetName}</span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-mono text-[var(--color-secondary)] mt-2 block flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Granular Color Tuning + Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Fine-Tuning Controls */}
              <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <h4 className="text-sm font-bold text-white font-mono uppercase text-[var(--color-primary)]">
                    Fine-Tuning Color Values
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      resetTheme();
                      setCustomTheme(themePresets[0]);
                      showToast('Reset to Obsidian Default colors.');
                    }}
                    className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Default</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white">Primary Accent</label>
                      <span className="font-mono text-xs text-[#cbc3d7]">{customTheme.primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Signal */}
                  <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white">Secondary Signal (Lime)</label>
                      <span className="font-mono text-xs text-[#cbc3d7]">{customTheme.secondaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Canvas Background */}
                  <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white">Canvas Void Background</label>
                      <span className="font-mono text-xs text-[#cbc3d7]">{customTheme.backgroundColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Surface Level 1 */}
                  <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white">Surface Card Level 1</label>
                      <span className="font-mono text-xs text-[#cbc3d7]">{customTheme.surfaceColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTheme.surfaceColor}
                        onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.surfaceColor}
                        onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      updateTheme(customTheme);
                      showToast('Color settings saved and applied to application!');
                    }}
                    className="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                  >
                    Apply Palette Changes
                  </button>
                </div>
              </div>

              {/* Live Swatch Preview */}
              <div className="lg:col-span-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Real-Time Component Swatch</span>
                  </h4>
                  <p className="text-xs text-[#a1a1aa] mb-4">
                    Sample elements rendered with current theme tokens:
                  </p>

                  {/* Swatch Demo Card */}
                  <div
                    className="p-5 rounded-xl border space-y-4"
                    style={{
                      backgroundColor: customTheme.surfaceColor,
                      borderColor: customTheme.borderColor
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{ color: customTheme.primaryColor }}
                      >
                        Sample Component Card
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1.5"
                        style={{
                          backgroundColor: `${customTheme.secondaryColor}20`,
                          color: customTheme.secondaryColor,
                          border: `1px solid ${customTheme.secondaryColor}50`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: customTheme.secondaryColor }} />
                        Active Telemetry
                      </span>
                    </div>

                    <p className="text-xs text-[#cbc3d7]">
                      Obsidian Studio typography and micro-interactions powered by CSS custom properties.
                    </p>

                    <div className="flex items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: customTheme.primaryColor }}
                      >
                        Primary Action
                      </button>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 text-xs font-medium text-[#e2e0fa] rounded-lg border"
                        style={{
                          backgroundColor: customTheme.surfaceContainer,
                          borderColor: customTheme.borderColor
                        }}
                      >
                        Secondary Outline
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-xs text-[#71717a] flex justify-between font-mono">
                  <span>Tokens: Active</span>
                  <span>LocalStorage Persistent</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: Messages Inbox */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <Mail className="w-8 h-8 text-[#71717a] mx-auto mb-2" />
                <p className="text-sm text-[#a1a1aa]">No contact inquiries in studio queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      msg.status === 'unread'
                        ? 'bg-[#18192c] border-[var(--color-primary)]/50 shadow-md'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            msg.status === 'unread' ? 'bg-[var(--color-secondary)]' : 'bg-[#71717a]'
                          }`}
                        />
                        <h3 className="font-bold text-white text-sm">
                          {msg.subject}
                        </h3>
                        <span className="text-[11px] font-mono text-[#a1a1aa]">
                          from <strong className="text-[#e2e0fa]">{msg.name}</strong> ({msg.email})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-mono text-[#71717a]">{msg.createdAt}</span>
                        <div className="flex items-center gap-1.5">
                          {msg.status === 'unread' ? (
                            <button
                              onClick={() => {
                                updateMessageStatus(msg.id, 'read');
                                showToast('Marked as read.');
                              }}
                              className="px-2.5 py-1 rounded bg-[var(--color-surface-container)] hover:bg-[#28283b] text-xs text-[var(--color-secondary)] border border-[var(--color-border)] cursor-pointer"
                            >
                              Mark Read
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                updateMessageStatus(msg.id, 'unread');
                                showToast('Marked as unread.');
                              }}
                              className="px-2.5 py-1 rounded bg-[var(--color-surface-container)] hover:bg-[#28283b] text-xs text-[#a1a1aa] border border-[var(--color-border)] cursor-pointer"
                            >
                              Mark Unread
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deleteMessage(msg.id);
                              showToast('Deleted inquiry.');
                            }}
                            className="p-1 rounded bg-[#2b161b] hover:bg-[#3b1c24] text-[#ffb4ab] border border-[#ffb4ab]/30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#cbc3d7] leading-relaxed bg-[var(--color-bg)] p-3.5 rounded-xl border border-[var(--color-border)]">
                      {msg.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="text-[var(--color-primary)] hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Compose Direct Email Response</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: Telemetry & Controls */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-display mb-1">
                  System Operational Mode
                </h3>
                <p className="text-xs text-[#a1a1aa]">
                  Current state broadcasted to visitors across all portfolio endpoints.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {(['Optimal', 'Maintenance', 'Deploying'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateTelemetryStatus(status);
                      showToast(`Operational mode switched to ${status}.`);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      telemetry.systemStatus === status
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                        : 'bg-[var(--color-surface-container)] text-[#a1a1aa] border-[var(--color-border)] hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/50">
                  <span className="text-[#a1a1aa]">Ingress Load:</span>
                  <span className="font-mono text-white">{persona.studioThroughput}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/50">
                  <span className="text-[#a1a1aa]">Cluster Edge Nodes:</span>
                  <span className="font-mono text-[var(--color-secondary)]">14 Nodes Live</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-border)]/50">
                  <span className="text-[#a1a1aa]">Client Latency:</span>
                  <span className="font-mono text-white">{persona.metricLatency} average</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#a1a1aa]">Database Layer:</span>
                  <span className="font-mono text-[#d0bcff]">Local Persistence Engine</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-display mb-1">
                  Studio Data Synchronization
                </h3>
                <p className="text-xs text-[#a1a1aa]">
                  Export or restore studio configuration artifacts.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const data = {
                      projects,
                      messages,
                      telemetry,
                      skills,
                      persona,
                      theme,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: 'application/json'
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `obsidian-studio-backup-${Date.now()}.json`;
                    a.click();
                    showToast('Backup JSON exported successfully.');
                  }}
                  className="w-full py-2.5 px-4 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Export Complete Schema Backup</span>
                </button>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Reload default sample portfolio projects, skills, and test messages?'
                      )
                    ) {
                      contentStorage.removeItem('obsidian_studio_projects_v1');
                      localStorage.removeItem('obsidian_studio_messages_v1');
                      contentStorage.removeItem('obsidian_studio_skills_v1');
                      contentStorage.removeItem('obsidian_studio_persona_v1');
                      contentStorage.removeItem('obsidian_studio_theme_v1');
                      refreshData();
                      showToast('Default sample data restored.');
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#cbc3d7] border border-[var(--color-border)] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[var(--color-secondary)]" />
                  <span>Restore Initial Mock Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* Add / Edit Project Modal */}
      {/* ---------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
              <h3 className="text-xl font-bold font-display text-white">
                {editingProject ? 'Edit Portfolio Exhibit' : 'Add New Portfolio Exhibit'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-[var(--color-surface-container)] text-[#a1a1aa] hover:text-white border border-[var(--color-border)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Apex Visualizer"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Tagline / Brief Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Sub-millisecond node-graph reactive compiler"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Classification Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Project['category'])}
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Performance Metric Badge
                  </label>
                  <input
                    type="text"
                    value={formMetrics}
                    onChange={(e) => setFormMetrics(e.target.value)}
                    placeholder="e.g. < 1.2ms latency"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  placeholder="/images/... or https://"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Tech Stack Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="TypeScript, WebGL, React 19, Tailwind"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Architecture Overview / Full Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed architectural breakdown..."
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Engineering Highlights (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  placeholder="Achieved sub-millisecond execution&#10;Zero regression test coverage"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Demo URL
                  </label>
                  <input
                    type="text"
                    value={formDemoUrl}
                    onChange={(e) => setFormDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="featuredToggle" className="text-white cursor-pointer select-none">
                  Highlight as Featured System in Bento Grid
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#a1a1aa] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Add / Edit Experience Modal */}
      {/* ---------------------------------------------------- */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
              <h3 className="text-xl font-bold font-display text-white">
                {editingExperienceId ? 'Edit Role' : 'Add Role to Engineering History'}
              </h3>
              <button
                onClick={() => setIsExperienceModalOpen(false)}
                className="p-1.5 rounded-full bg-[var(--color-surface-container)] text-[#a1a1aa] hover:text-white border border-[var(--color-border)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cbc3d7] font-medium mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={experienceForm.period}
                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                    placeholder="e.g. 2023 — Present"
                    className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  placeholder="What you owned and built in this role..."
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Key Highlight
                </label>
                <input
                  type="text"
                  value={experienceForm.highlight}
                  onChange={(e) => setExperienceForm({ ...experienceForm, highlight: e.target.value })}
                  placeholder="e.g. Cut page load time by 40% across the product"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={experienceTech}
                  onChange={(e) => setExperienceTech(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExperienceModalOpen(false)}
                  className="px-4 py-2 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#a1a1aa] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingExperienceId ? 'Save Changes' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Add / Edit Skill Domain Modal */}
      {/* ---------------------------------------------------- */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                <span>{editingDomainId ? 'Edit Skill Domain' : 'Add Skill Domain'}</span>
              </h3>
              <button
                onClick={() => setIsDomainModalOpen(false)}
                className="p-1 rounded-full bg-[var(--color-surface-container)] text-[#a1a1aa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Domain Title *
                </label>
                <input
                  type="text"
                  required
                  value={domainTitle}
                  onChange={(e) => setDomainTitle(e.target.value)}
                  placeholder="e.g. Backend & APIs"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={domainSubtitle}
                  onChange={(e) => setDomainSubtitle(e.target.value)}
                  placeholder="e.g. Services, data and integrations"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDomainModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[var(--color-surface-container)] text-[#a1a1aa] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingDomainId ? 'Save Changes' : 'Add Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Add Skill Modal */}
      {/* ---------------------------------------------------- */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Add Frontend / Technical Skill</span>
              </h3>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="p-1 rounded-full bg-[var(--color-surface-container)] text-[#a1a1aa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Target Domain Category
                </label>
                <select
                  value={skillCategorySelect}
                  onChange={(e) => setSkillCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                >
                  {skills.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Skill / Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Next.js App Router or WebGL 2"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Mastery Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none font-mono"
                >
                  <option value="Mastery">Mastery</option>
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cbc3d7] font-medium mb-1">
                  Engineering Focus / Summary
                </label>
                <input
                  type="text"
                  value={skillFocus}
                  onChange={(e) => setSkillFocus(e.target.value)}
                  placeholder="e.g. Concurrent rendering, server actions, AST transforms"
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-white focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[var(--color-surface-container)] text-[#a1a1aa] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
