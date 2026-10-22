/**
 * Site configuration — the single place to edit what the portfolio says.
 *
 * - Text, links, labels and feature flags live here.
 * - Projects, experience, skills and theme presets live in src/data/initialData.ts.
 * - Any change to either file is picked up automatically on next page load:
 *   browser-cached copies of the defaults are discarded when the defaults change
 *   (see portfolioService.ts).
 * - Leave an optional string empty ('') or a list empty ([]) to hide that element.
 *
 * Keep this file free of browser-only code: vite.config.ts imports it to fill
 * the <title> and meta tags in index.html at build time.
 */
import type { PersonaConfig } from '../types';

/** Project categories, in the order the filter tabs show them. */
export const PROJECT_CATEGORIES = ['Developer Tools', 'Creative Tech', 'Audio & Spatial', 'Web Systems'] as const;

const persona: PersonaConfig = {
  name: 'Aakash Gaurab',
  roleTitle: 'Software Engineer & Frontend Developer',
  headline: 'Architecting high-density interfaces & reactive creative systems.',
  leadTagline: 'At the intersection of precision frontend systems and computational design. Specializing in sub-millisecond node graphs, WebGL/WebAudio DSP pipelines, and enterprise design system infrastructure.',
  bio: 'Software engineer crafting high-performance React interfaces, scalable fintech applications, and modern web experiences through thoughtful architecture and precision engineering.',
  availabilityText: 'Open to Opportunities',
  isAvailable: true,
  location: 'San Francisco, CA / Berlin / Remote',
  heroImage: '/images/hero_creative_developer_1791460352002.jpg',
  studioThroughput: '4.2M req/d',
  metricLatency: '< 1.2ms',
  metricSLA: '99.99%',
  metricTeams: '18+',
  contactEmail: 'aakashgaurav456@gmail.com',
  githubUrl: 'https://github.com/your-username',
  linkedinUrl: 'https://www.linkedin.com/in/your-profile'
};

export const SITE_CONFIG = {
  /** Browser tab title, search-engine and social-share text. */
  meta: {
    title: `${persona.name} | ${persona.roleTitle}`,
    description: `Personal portfolio of ${persona.name}, a software engineer specializing in React, TypeScript, modern frontend architecture, micro-frontends, and fintech integrations. Explore projects, technical expertise, and creative engineering work.`
  },

  features: {
    /** Show "Admin" / "Login" buttons in the navbar and footer. /admin stays reachable by URL either way. */
    showAdminLinks: false
  },

  /** Google Analytics 4. Added to production builds only (not `npm run dev`). Set to '' to disable. */
  analytics: {
    googleMeasurementId: 'G-1RZS6RXSMX'
  },

  /** Default persona; editable later in Admin → Persona. */
  persona,

  /** Section anchors used by the navbar and footer. Remove an entry to drop the link. */
  nav: [
    { sectionId: 'projects', label: 'Works' },
    { sectionId: 'expertise', label: 'Capabilities' },
    { sectionId: 'experience', label: 'Track Record' },
    { sectionId: 'contact', label: 'Contact' }
  ],

  /** Resume PDF in public/. Set file to '' to hide every resume button. */
  resume: {
    file: '/Aakash-Gaurab_Resume.pdf',
    /** File name the browser saves the download as. */
    downloadName: 'Aakash-Gaurab_Resume.pdf',
    label: 'Resume',
    mobileLabel: 'Download Resume'
  },

  /** Floating AI chat assistant (answers from the admin-managed content plus src/data/chatProfile.ts; hidden unless VITE_GEMINI_API_KEY is set). */
  chat: {
    enabled: true,
    title: "Aakash's AI",
    status: 'Ask me about Aakash',
    openLabel: 'Chat with my AI assistant',
    greeting: "Hey, this is Aakash's AI. How can I help you?",
    placeholder: 'Ask about skills, experience, projects...',
    suggestions: ['What does Aakash work on?', 'What are his top skills?', 'How can I contact him?'],
    resetLabel: 'Reset chat',
    closeLabel: 'Close chat',
    sendLabel: 'Send',
    errorText: 'Sorry, I ran into an error generating a reply. Please try again.',
    limitText: "You've reached today's chat limit. Please use the contact form or email Aakash directly."
  },

  hero: {
    primaryCta: 'Explore Selected Works',
    secondaryCta: 'Get in Touch',
    /** Label/caption for each persona metric. Set a label to '' to hide that metric. */
    metrics: {
      latency: { label: 'Latency Profile', caption: 'Graph node eval' },
      sla: { label: 'Runtime SLA', caption: 'Production stability' },
      teams: { label: 'Engaged Teams', caption: 'Shipped systems' }
    },
    throughputLabel: 'Throughput'
  },

  projects: {
    eyebrow: 'Selected Portfolio',
    title: 'Featured Architecture & Systems',
    subtitle: 'High-impact engineering work spanning reactive compilers, parametric sound engines, and design verification tools.',
    allCategoriesLabel: 'All',
    searchPlaceholder: 'Search by tech or keyword...',
    featuredBadge: 'Featured'
  },

  projectModal: {
    taglineLabel: 'Overview',
    metricLabel: 'Key Metric',
    descriptionLabel: 'Architecture & Overview',
    highlightsLabel: 'Key Achievements',
    roleLabel: 'Role',
    clientLabel: 'Client',
    yearLabel: 'Year',
    categoryLabel: 'Category',
    stackLabel: 'Technology Stack',
    demoLabel: 'Live Demo',
    sourceLabel: 'Source Code',
    closeLabel: 'Close (ESC)'
  },

  skills: {
    eyebrow: 'Technical Capabilities',
    title: 'Engineering Toolchain & Disciplines',
    subtitle: 'The technologies I work with, from interface foundations to deployment pipelines.'
  },

  experience: {
    eyebrow: 'Track Record',
    title: 'Engineering History',
    subtitle: 'Roles, teams and the impact delivered along the way.',
    highlightLabel: 'Key Impact',
    technologiesLabel: 'Technologies'
  },

  contact: {
    eyebrow: 'Direct Inquiries',
    title: "Let's build something remarkable.",
    subtitle: 'Open to full-time roles, freelance projects and collaborations. Drop a message and I will get back to you.',
    /** Extra info lines under the intro. Location is added automatically from the persona. */
    details: ['Response Time: Typically under 24 hours'],
    emailLabel: 'Email',
    formTitle: 'Send a Message',
    nameLabel: 'Your Name / Organization',
    namePlaceholder: 'e.g. Jane Doe',
    emailFieldLabel: 'Email Address',
    emailPlaceholder: 'jane@company.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'e.g. Frontend role at Acme',
    defaultSubject: 'Portfolio Inquiry',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me about the role, project or idea...',
    submitLabel: 'Send Message',
    submittingLabel: 'Sending...',
    successTitle: 'Message Received',
    successText: 'Thanks for reaching out — I will reply soon.',
    validationError: 'Please provide your name, a valid email, and a message.',
    sendError: 'Failed to send message. Please retry or email directly.'
  },

  footer: {
    /** Footer blurb comes from persona.bio. */
    navHeading: 'Navigation',
    linksHeading: 'Network',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    /** Small badges in the bottom bar, e.g. certifications. */
    badges: ['NSDC Certified Developer'],
    builtWith: 'Built with React & Tailwind CSS.',
    backToTop: 'Back to top'
  }
};
