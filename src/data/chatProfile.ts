import { PersonaConfig, Project, SkillCategory, ExperienceItem } from '../types';

/**
 * Facts the chat assistant knows that can't be edited in the admin panel. Taken from
 * public/Aakash-Gaurab_Resume.pdf — update both together. Everything else (persona,
 * skills, experience, projects) comes from the live admin content via buildChatProfile.
 */
const RESUME_FACTS = {
  highlights: [
    'Improved PWA load times by 25%.',
    'Reduced unauthorized access by 40% via multi-layered security.',
    'Remediated 120+ SonarQube issues, raising code quality to 92%.',
    'Implemented Sentry monitoring, halving outages.',
    'Configured 60+ production programs supporting 500K users.',
    'Led bank API integrations for 100K+ monthly secure transactions.'
  ],
  education: [
    { institution: 'Masai School', program: 'Full Stack Web Development (MERN Stack)', period: 'June 2022 – December 2023' },
    { institution: 'National Institute of Open Schooling', program: 'Higher Secondary Education (12th, Science), 75%', period: 'June 2017 – October 2019' }
  ],
  certifications_awards: [
    { title: 'Certified Prompt Engineer', issued_by: 'Masai School', date: 'September 2023', note: 'Prompt engineering for rapid learning of new tech stacks.' },
    { title: 'Certificate of Appreciation', issued_by: 'Masai School', date: 'April 2023', note: 'Good behavior and commitment.' }
  ],
  phone: '+91 7808927193',
  preferred_work_type: 'Remote'
};

export interface ChatProfileSource {
  persona: PersonaConfig;
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
}

/**
 * The profile chatService.ts sends in the system prompt, built from the same content the
 * public site shows, so admin edits are reflected in answers on the next message.
 */
export function buildChatProfile({ persona, projects, skills, experience }: ChatProfileSource) {
  return {
    summary: {
      name: persona.name,
      role: persona.roleTitle,
      headline: persona.headline,
      tagline: persona.leadTagline,
      bio: persona.bio,
      location: persona.location,
      highlights: RESUME_FACTS.highlights
    },
    availability: {
      open_to_work: persona.isAvailable,
      status: persona.availabilityText,
      preferred_work_type: RESUME_FACTS.preferred_work_type
    },
    skills: skills
      .filter((cat) => cat.skills.length > 0)
      .map((cat) => ({
        domain: cat.title,
        skills: cat.skills.map((s) => ({ name: s.name, level: s.level, focus: s.focus }))
      })),
    work_experience: experience.map((e) => ({
      title: e.role,
      company: e.company,
      location: e.location,
      period: e.period,
      description: e.description,
      highlight: e.highlight,
      technologies: e.technologies
    })),
    projects: projects.map((p) => ({
      name: p.title,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      year: p.year,
      role: p.role,
      client: p.client,
      stack: p.tags,
      highlights: p.highlights,
      demo: p.demoUrl,
      github: p.githubUrl
    })),
    education: RESUME_FACTS.education,
    certifications_awards: RESUME_FACTS.certifications_awards,
    contact_social_links: {
      email: persona.contactEmail,
      phone: RESUME_FACTS.phone,
      github: persona.githubUrl,
      linkedin: persona.linkedinUrl,
      resume: 'A PDF resume can be downloaded with the "Resume" button in the site navigation.'
    }
  };
}
