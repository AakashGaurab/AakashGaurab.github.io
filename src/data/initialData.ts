import { Project, ExperienceItem, SkillCategory, ContactMessage, StudioTelemetry, PersonaConfig, ThemeConfig } from '../types';
import { SITE_CONFIG } from '../config/site.config';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'QuantumFlow Engine',
    slug: 'quantum-flow-engine',
    tagline: 'Reactive node-graph execution engine with real-time distributed state synchronization',
    description: 'A high-performance visual workflow engine built for telemetry routing and graph computation pipelines. Features zero-lag canvas panning with WebGL acceleration, sub-millisecond node evaluations, and end-to-end type safety.',
    category: 'Developer Tools',
    tags: ['TypeScript', 'WebGL', 'Web Workers', 'Rust/Wasm', 'Tailwind CSS'],
    coverImage: '/images/project_quantum_flow_1791460364535.jpg',
    demoUrl: 'https://example.com/demo/quantumflow',
    githubUrl: 'https://github.com/obsidian-studio/quantumflow',
    featured: true,
    metrics: '< 1.2ms latency at 50k nodes',
    year: '2026',
    role: 'Lead Architect & Systems Engineer',
    client: 'Aether Systems Inc.',
    highlights: [
      'Engineered sub-millisecond graph topological sorting via WebAssembly pipeline.',
      'Achieved steady 60 FPS viewport rendering across 50,000 simultaneous canvas nodes.',
      'Designed collaborative canvas multiplexer handling 100+ concurrent operators.'
    ]
  },
  {
    id: 'proj-2',
    title: 'Hyperion Audio Workstation',
    slug: 'hyperion-audio-workstation',
    tagline: 'Web Audio API parametric synthesizer with hardware controller MIDI integration',
    description: 'An avant-garde sound synthesis workstation running natively inside the browser. Provides dual-oscillator FM routing, analog-modeled ladder filters, responsive visual spectrograms, and instant preset serialization.',
    category: 'Audio & Spatial',
    tags: ['Web Audio API', 'AudioWorklet', 'React', 'Canvas 2D', 'DSP'],
    coverImage: '/images/project_hyperion_synth_1791460375570.jpg',
    demoUrl: 'https://example.com/demo/hyperion',
    githubUrl: 'https://github.com/obsidian-studio/hyperion-synth',
    featured: true,
    metrics: '96kHz / 32-bit float audio buffer',
    year: '2025',
    role: 'Creative Technologist',
    client: 'Vektor Sound Lab',
    highlights: [
      'Created custom AudioWorklet DSP processor minimizing audio thread jitter to < 0.1ms.',
      'Rendered real-time 1024-band FFT spectral analyzer with optimized typed arrays.',
      'Constructed WebMIDI hardware bridge supporting Class-Compliant master keyboards.'
    ]
  },
  {
    id: 'proj-3',
    title: 'NeuralCanvas Studio',
    slug: 'neural-canvas-studio',
    tagline: 'Design token governance platform and generative layout validation suite',
    description: 'An enterprise design system inspection environment that automatically tests React component trees against strict typography scales, contrast ratios, and spatial grid mathematical invariants.',
    category: 'Creative Tech',
    tags: ['React 19', 'Design Systems', 'AST Parser', 'Tailwind', 'CSS Houdini'],
    coverImage: '/images/project_neural_canvas_1791460386996.jpg',
    demoUrl: 'https://example.com/demo/neuralcanvas',
    githubUrl: 'https://github.com/obsidian-studio/neural-canvas',
    featured: true,
    metrics: '1,400+ production components audited',
    year: '2025',
    role: 'Design Technologist & Staff Engineer',
    client: 'Monolith Design Corp.',
    highlights: [
      'Built automated WCAG AA color delta scanner running on canvas bitmap snapshots.',
      'Reduced enterprise design system drift across 12 product teams by 78%.',
      'Developed real-time token diff visualizer with interactive component hot-swapping.'
    ]
  },
  {
    id: 'proj-4',
    title: 'Strata Cloud Telemetry',
    slug: 'strata-cloud-telemetry',
    tagline: 'Distributed multi-cloud observability portal with sub-second metric aggregation',
    description: 'A dark-mode high-density operational telemetry dashboard delivering unified metrics across Kubernetes clusters, edge workers, and distributed storage nodes.',
    category: 'Web Systems',
    tags: ['TypeScript', 'Next.js', 'Go', 'TimescaleDB', 'gRPC-Web'],
    coverImage: '/images/hero_creative_developer_1791460352002.jpg',
    demoUrl: 'https://example.com/demo/strata',
    githubUrl: 'https://github.com/obsidian-studio/strata-telemetry',
    featured: false,
    metrics: '4.2M events/sec ingestion throughput',
    year: '2024',
    role: 'Principal Engineer',
    client: 'Stratum Infrastructure',
    highlights: [
      'Architected high-throughput columnar visualization grid for streaming log telemetry.',
      'Cut dashboard memory footprint by 62% using virtualized scroll viewports.'
    ]
  }
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Principal Design Technologist & Architect',
    company: 'Obsidian Studio Labs',
    location: 'San Francisco, CA / Remote',
    period: '2023 — Present',
    description: 'Leading the technical design and systems architecture for modern developer tools, real-time creative platforms, and high-performance WebGL/WebAudio interfaces.',
    technologies: ['TypeScript', 'React 19', 'WebGL', 'WebAssembly', 'Tailwind CSS', 'Node.js'],
    highlight: 'Delivered 8 mission-critical client platforms with 99.98% uptime SLA.'
  },
  {
    id: 'exp-2',
    role: 'Staff Frontend Systems Engineer',
    company: 'Vektor Systems',
    location: 'Berlin / Hybrid',
    period: '2021 — 2023',
    description: 'Architected company-wide design system infrastructure, state synchronization libraries, and client-side performance auditing workflows.',
    technologies: ['React', 'TypeScript', 'Turborepo', 'GraphQL', 'Tailwind CSS'],
    highlight: 'Accelerated core app render latency by 45% across 2.4 million daily active sessions.'
  },
  {
    id: 'exp-3',
    role: 'Senior Creative Technologist',
    company: 'Aura Interactive',
    location: 'London, UK',
    period: '2019 — 2021',
    description: 'Developed bespoke interactive editorial exhibits, 3D product viewports, and custom real-time audio installations for global brands.',
    technologies: ['Three.js', 'Web Audio API', 'GLSL', 'Vue.js', 'Express'],
    highlight: 'Recognized with FWA of the Day and Awwwards Site of the Month honors.'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'cat-1',
    title: 'Frontend & Architecture',
    subtitle: 'System engineering and interface foundations',
    skills: [
      { id: 'sk-1', name: 'TypeScript (Strict Mode)', level: 'Expert', focus: 'Type-level programming, AST transforms', category: 'cat-1' },
      { id: 'sk-2', name: 'React 19 & Next.js', level: 'Mastery', focus: 'Concurrent rendering, Server Components, Hooks', category: 'cat-1' },
      { id: 'sk-3', name: 'Tailwind CSS & Token Systems', level: 'Mastery', focus: 'Design token architecture, modern layout math', category: 'cat-1' },
      { id: 'sk-4', name: 'JavaScript (ES2024+)', level: 'Expert', focus: 'Event loop, Memory management, Web Workers', category: 'cat-1' },
      { id: 'sk-5', name: 'State Architecture', level: 'Advanced', focus: 'Zustand, Signals, Reactive observable pipelines', category: 'cat-1' }
    ]
  },
  {
    id: 'cat-2',
    title: 'Graphics, Audio & DSP',
    subtitle: 'Interactive sensory engineering',
    skills: [
      { id: 'sk-6', name: 'WebGL & Canvas 2D', level: 'Advanced', focus: 'Custom shaders, GPU particle acceleration', category: 'cat-2' },
      { id: 'sk-7', name: 'Web Audio API', level: 'Advanced', focus: 'AudioWorklets, Synthesizer modules, FFT analyzers', category: 'cat-2' },
      { id: 'sk-8', name: 'Motion & Physics', level: 'Expert', focus: 'Spring physics, Hardware-accelerated transforms', category: 'cat-2' },
      { id: 'sk-9', name: 'Rust & WebAssembly', level: 'Proficient', focus: 'DSP calculations, Memory-mapped buffers', category: 'cat-2' }
    ]
  },
  {
    id: 'cat-3',
    title: 'Infrastructure & Tooling',
    subtitle: 'Reliability and deployment pipelines',
    skills: [
      { id: 'sk-10', name: 'Vite & Bundler Tooling', level: 'Expert', focus: 'Plugin authoring, ESM optimization, Tree-shaking', category: 'cat-3' },
      { id: 'sk-11', name: 'REST & GraphQL APIs', level: 'Expert', focus: 'Schema validation, Streaming responses', category: 'cat-3' },
      { id: 'sk-12', name: 'Docker & Cloud Deployment', level: 'Proficient', focus: 'Containerized micro-frontends, Edge CDN', category: 'cat-3' },
      { id: 'sk-13', name: 'CI/CD & Automated Testing', level: 'Advanced', focus: 'Vitest, Playwright, Zero-regression pipelines', category: 'cat-3' }
    ]
  }
];

export const INITIAL_PERSONA: PersonaConfig = SITE_CONFIG.persona;

export const INITIAL_THEME: ThemeConfig = {
  presetName: 'Electric Obsidian (Default)',
  primaryColor: '#8b5cf6',
  primaryGlow: 'rgba(139, 92, 246, 0.45)',
  secondaryColor: '#84cc16',
  backgroundColor: '#09090b',
  surfaceColor: '#13141f',
  surfaceContainer: '#1e1f2e',
  borderColor: '#27273a'
};

export const THEME_PRESETS: ThemeConfig[] = [
  {
    presetName: 'Electric Obsidian (Default)',
    primaryColor: '#8b5cf6',
    primaryGlow: 'rgba(139, 92, 246, 0.45)',
    secondaryColor: '#84cc16',
    backgroundColor: '#09090b',
    surfaceColor: '#13141f',
    surfaceContainer: '#1e1f2e',
    borderColor: '#27273a'
  },
  {
    presetName: 'Cyberpunk Emerald & Lime',
    primaryColor: '#10b981',
    primaryGlow: 'rgba(16, 185, 129, 0.45)',
    secondaryColor: '#94de2d',
    backgroundColor: '#080c09',
    surfaceColor: '#0f1712',
    surfaceContainer: '#16221c',
    borderColor: '#21342a'
  },
  {
    presetName: 'Deep Cyan Matrix',
    primaryColor: '#06b6d4',
    primaryGlow: 'rgba(6, 182, 212, 0.45)',
    secondaryColor: '#38bdf8',
    backgroundColor: '#060b11',
    surfaceColor: '#0c1522',
    surfaceContainer: '#142234',
    borderColor: '#1d324d'
  },
  {
    presetName: 'Carbon Solar Amber',
    primaryColor: '#f59e0b',
    primaryGlow: 'rgba(245, 158, 11, 0.45)',
    secondaryColor: '#eab308',
    backgroundColor: '#0c0a07',
    surfaceColor: '#18140c',
    surfaceContainer: '#241e13',
    borderColor: '#382f1e'
  },
  {
    presetName: 'Hyper Rose Neon',
    primaryColor: '#f43f5e',
    primaryGlow: 'rgba(244, 63, 94, 0.45)',
    secondaryColor: '#fb7185',
    backgroundColor: '#0e0709',
    surfaceColor: '#190d12',
    surfaceContainer: '#26141c',
    borderColor: '#3c1f2c'
  }
];

// Inbox starts empty; messages arrive through the contact form.
export const INITIAL_MESSAGES: ContactMessage[] = [];

export const INITIAL_TELEMETRY: StudioTelemetry = {
  activeDeployments: 14,
  uptimePercent: 99.99,
  totalProjects: 18,
  clientSatisfaction: 98.4,
  systemStatus: 'Optimal',
  latencyMs: 14
};
