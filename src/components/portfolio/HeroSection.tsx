import { ArrowDown, Activity, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG } from '../../config/site.config';

interface HeroSectionProps {
  /** Omitted when there is no projects section to scroll to. */
  onExploreClick?: () => void;
  onContactClick: () => void;
}

export function HeroSection({ onExploreClick, onContactClick }: HeroSectionProps) {
  const { persona } = usePortfolio();
  const { hero } = SITE_CONFIG;
  const metrics = [
    { ...hero.metrics.latency, value: persona.metricLatency, valueClass: 'text-[var(--color-secondary)]' },
    { ...hero.metrics.sla, value: persona.metricSLA, valueClass: 'text-white' },
    { ...hero.metrics.teams, value: persona.metricTeams, valueClass: 'text-[var(--color-primary)]' }
  ].filter((m) => m.label && m.value);

  return (
    <section className="relative pt-12 pb-20 md:py-24 overflow-hidden border-b border-[var(--color-border)]">
      {/* Subtle background ambient scattering */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Lead-in */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono text-[#e2e0fa]">
                <span className={`w-2 h-2 rounded-full ${persona.isAvailable ? 'bg-[var(--color-secondary)] animate-pulse' : 'bg-[#a1a1aa]'}`} />
                <span>{persona.roleTitle}</span>
              </span>
              <span className="text-xs text-[#71717a] font-mono hidden sm:inline">
                {persona.location}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.08] text-balance">
              {persona.headline}
            </h1>

            {/* Body Narrative */}
            <p className="text-base sm:text-lg text-[#cbc3d7] max-w-xl leading-relaxed">
              {persona.leadTagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {onExploreClick && (
                <button
                  onClick={onExploreClick}
                  className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-[0_4px_20px_-2px_color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition-all cursor-pointer"
                >
                  <span>{hero.primaryCta}</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onContactClick}
                className="px-5 py-2.5 bg-[var(--color-surface)] hover:bg-[var(--color-surface-container)] text-[#e2e0fa] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-sm font-medium rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{hero.secondaryCta}</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--color-primary)]" />
              </button>
            </div>

            {/* Claim-to-Proof Quantitative Adjacency Bar */}
            {metrics.length > 0 && (
              <div className="pt-6 border-t border-[var(--color-border)]/60 grid grid-cols-3 gap-4 max-w-lg">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <span className="text-xs font-mono text-[#71717a] block">{m.label}</span>
                    <span className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${m.valueClass}`}>{m.value}</span>
                    <span className="text-[11px] text-[#958ea0] block">{m.caption}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Visual Container & Studio Atmosphere */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                <img
                  src={persona.heroImage}
                  alt={persona.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/30 to-transparent" />

              {/* Inset Studio Telemetry Card */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-container)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)]">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">{persona.name}</span>
                    <span className="text-[11px] text-[#a1a1aa] font-mono">{persona.availabilityText}</span>
                  </div>
                </div>
                {persona.studioThroughput && (
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[var(--color-secondary)] block tabular-nums">{persona.studioThroughput}</span>
                    <span className="text-[10px] text-[#71717a]">{hero.throughputLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
