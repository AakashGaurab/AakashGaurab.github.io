import React, { useEffect } from 'react';
import { Project } from '../../types';
import { SITE_CONFIG } from '../../config/site.config';
import { X, ExternalLink, Github, CheckCircle2, Calendar, Tag, UserCheck, Layers } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const copy = SITE_CONFIG.projectModal;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[var(--color-bg)]/80 backdrop-blur-md animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_24px_-4px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] z-10 text-[#f4f4f5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 text-[#a1a1aa] hover:text-white bg-[var(--color-surface-container)]/80 hover:bg-[var(--color-border)] border border-[var(--color-border)] rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-t-2xl bg-[var(--color-bg)]">
          <img
            src={project.coverImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback styling if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/40 to-transparent" />

          {/* Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)]">
              <span>{project.category}</span>
              <span className="text-[#958ea0]">/</span>
              <span>{project.year}</span>
              {project.client && (
                <>
                  <span className="text-[#958ea0]">/</span>
                  <span className="text-[#e2e0fa]">{project.client}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Tagline & Key Metric Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-border)]">
            <div>
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                {copy.taglineLabel}
              </span>
              <p className="text-sm sm:text-base text-[#e2e0fa] font-medium">
                {project.tagline}
              </p>
            </div>
            {project.metrics && (
              <div className="shrink-0 sm:text-right border-t sm:border-t-0 sm:border-l border-[var(--color-border)] pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-mono text-[var(--color-secondary)] block uppercase tracking-wider">
                  {copy.metricLabel}
                </span>
                <span className="text-sm font-bold text-white font-mono tabular-nums">
                  {project.metrics}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-2">
              {copy.descriptionLabel}
            </h3>
            <p className="text-sm sm:text-base text-[#cbc3d7] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Engineering Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-3">
                {copy.highlightsLabel}
              </h3>
              <ul className="space-y-2.5">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[#e2e0fa]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
            <div>
              <span className="text-[#71717a] block mb-1">{copy.roleLabel}</span>
              <span className="text-[#f4f4f5] font-medium">{project.role}</span>
            </div>
            {project.client && (
              <div>
                <span className="text-[#71717a] block mb-1">{copy.clientLabel}</span>
                <span className="text-[#f4f4f5] font-medium">{project.client}</span>
              </div>
            )}
            <div>
              <span className="text-[#71717a] block mb-1">{copy.yearLabel}</span>
              <span className="text-[#f4f4f5] font-medium">{project.year}</span>
            </div>
            <div>
              <span className="text-[#71717a] block mb-1">{copy.categoryLabel}</span>
              <span className="text-[var(--color-primary)] font-medium">{project.category}</span>
            </div>
          </div>

          {/* Technology Stack Tags */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
              {copy.stackLabel}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[#cbc3d7] font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{copy.demoLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[var(--color-surface-container)] hover:bg-[var(--color-border)] text-[#f4f4f5] border border-[var(--color-border)] text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>{copy.sourceLabel}</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors cursor-pointer"
            >
              {copy.closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
