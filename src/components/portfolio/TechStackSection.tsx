import { usePortfolio } from '../../context/PortfolioContext';
import { Cpu } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site.config';
import { Reveal } from '../common/Reveal';

export function TechStackSection() {
  const { visibleSkills: skills } = usePortfolio();
  const copy = SITE_CONFIG.skills;

  if (skills.length === 0) return null;

  return (
    <section id="expertise" className="py-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-14">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>{copy.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            {copy.title}
          </h2>
          <p className="text-sm text-[#cbc3d7] mt-2 max-w-2xl">
            {copy.subtitle}
          </p>
        </Reveal>

        {/* 3-Column Categorized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((cat, idx) => (
            <Reveal
              key={cat.id || idx}
              delay={idx * 0.1}
              whileHover={{ y: -4 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-[0_0_28px_-8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition-[border-color,box-shadow] rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="mb-5 pb-4 border-b border-[var(--color-border)]">
                  <span className="text-[11px] font-mono text-[#71717a] block mb-1">
                    Domain {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold font-display text-white">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {cat.skills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#f4f4f5]">{skill.name}</span>
                        <span className="font-mono text-[11px] text-[var(--color-secondary)]">{skill.level}</span>
                      </div>
                      <p className="text-[11px] text-[#71717a]">
                        {skill.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
