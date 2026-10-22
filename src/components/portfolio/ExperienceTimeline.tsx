import { Briefcase, Milestone, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG } from '../../config/site.config';
import { Reveal } from '../common/Reveal';

export function ExperienceTimeline() {
  const { experience } = usePortfolio();
  const copy = SITE_CONFIG.experience;

  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-14">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider">
            <Milestone className="w-4 h-4" />
            <span>{copy.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {copy.title}
          </h2>
          <p className="text-sm text-[#cbc3d7] mt-2 max-w-2xl">
            {copy.subtitle}
          </p>
        </Reveal>

        {/* Timeline Items */}
        <div className="space-y-6">
          {experience.map((item, idx) => (
            <Reveal
              key={item.id}
              x={-32}
              y={0}
              delay={idx * 0.08}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 hover:border-[var(--color-border-strong)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {item.role}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-mono mt-0.5">
                    <span className="font-semibold">{item.company}</span>
                    <span className="text-[#71717a]">·</span>
                    <span className="text-[#a1a1aa]">{item.location}</span>
                  </div>
                </div>
                <div className="font-mono text-xs text-[var(--color-secondary)] bg-[var(--color-surface-container)] border border-[var(--color-border)] px-3 py-1 rounded-full w-fit">
                  {item.period}
                </div>
              </div>

              <p className="text-sm text-[#cbc3d7] leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Highlight callout */}
              {item.highlight && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-surface-container)]/60 border border-[var(--color-border)] mb-4 text-xs text-[#e2e0fa]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-medium">{copy.highlightLabel}:</strong> {item.highlight}
                  </span>
                </div>
              )}

              {/* Technologies unboxed list */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                <span className="text-[#71717a]">{copy.technologiesLabel}:</span>
                {item.technologies.map((tech, tIdx) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-[var(--color-surface-container)] text-[#cbc3d7] border border-[var(--color-border)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
