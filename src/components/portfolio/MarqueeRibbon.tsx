import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

/** Infinite scrolling ribbon of skill names, built from the live skills list. */
export function MarqueeRibbon() {
  const { visibleSkills } = usePortfolio();
  const items = visibleSkills.flatMap((cat) => cat.skills.map((skill) => skill.name));

  if (items.length === 0) return null;

  // Rendered twice so translating by -50% loops seamlessly
  const renderRun = (keyPrefix: string) => (
    <div className="flex items-center gap-8 pr-8 shrink-0" aria-hidden={keyPrefix === 'clone' || undefined}>
      {items.map((item, idx) => (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          <span>{item}</span>
          <span className="text-[var(--color-primary)]">·</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-3 bg-[var(--color-surface)]/40 border-b border-[var(--color-border)] select-none [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max whitespace-nowrap animate-marquee text-xs font-mono font-medium uppercase tracking-widest text-[#a1a1aa]">
        {renderRun('run')}
        {renderRun('clone')}
      </div>
    </div>
  );
}
