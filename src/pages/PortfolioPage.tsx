import React from 'react';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ProjectShowcase } from '../components/portfolio/ProjectShowcase';
import { TechStackSection } from '../components/portfolio/TechStackSection';
import { ExperienceTimeline } from '../components/portfolio/ExperienceTimeline';
import { ContactSection } from '../components/portfolio/ContactSection';
import { ProjectDetailModal } from '../components/common/ProjectDetailModal';
import { ChatWidget } from '../components/common/ChatWidget';
import { usePortfolio } from '../context/PortfolioContext';

export function PortfolioPage() {
  const { projects, selectedProject, setSelectedProject } = usePortfolio();

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <HeroSection
        onExploreClick={projects.length > 0 ? () => handleScrollToSection('projects') : undefined}
        onContactClick={() => handleScrollToSection('contact')}
      />

      {/* Projects Showcase Bento Grid */}
      <ProjectShowcase />

      {/* Engineering Toolchain & Capabilities */}
      <TechStackSection />

      {/* Track Record & Experience */}
      <ExperienceTimeline />

      {/* Inquiries & Contact Form */}
      <ContactSection />

      {/* Lightbox Modal for Selected Project */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Floating AI chat assistant */}
      <ChatWidget />
    </div>
  );
}
