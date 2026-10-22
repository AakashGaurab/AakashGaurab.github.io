import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG, PROJECT_CATEGORIES } from '../../config/site.config';
import { Search, ExternalLink, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Reveal, TiltCard } from '../common/Reveal';

export function ProjectShowcase() {
  const {
    projects,
    filteredProjects,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProject
  } = usePortfolio();

  const copy = SITE_CONFIG.projects;
  // 'All' is the context's no-filter value; its label comes from config.
  // Categories without any project get no filter tab.
  const categories = ['All', ...PROJECT_CATEGORIES.filter((cat) => projects.some((p) => p.category === cat))];

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>{copy.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="text-sm text-[#cbc3d7] mt-2 max-w-xl">
              {copy.subtitle}
            </p>
          </Reveal>

          {/* Search input with sleek dark styling */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#71717a] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Interactive Segmented Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-x-auto mb-10 w-fit max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[var(--color-surface-container)]'
              }`}
            >
              {cat === 'All' ? copy.allCategoriesLabel : cat}
            </button>
          ))}
        </div>

        {/* Projects Bento Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-sm text-[#a1a1aa]">No projects match your filter query "{searchQuery}".</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {filteredProjects.map((project, index) => {
              // Bento layout: first project is full-width hero card, others are split
              const isLead = index === 0;
              const gridSpan = isLead ? 'lg:col-span-12' : index % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4 md:col-span-1';

              return (
                <TiltCard
                  key={project.id}
                  delay={(index % 3) * 0.08}
                  maxTilt={isLead ? 3 : 6}
                  onClick={() => setSelectedProject(project)}
                  className={`${gridSpan} group cursor-pointer relative bg-[var(--color-surface)] hover:bg-[var(--color-surface-container)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_-6px_color-mix(in_srgb,var(--color-bg)_80%,transparent),0_0_24px_-4px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] flex flex-col`}
                >
                  {/* Subtle top edge violet backlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Card Media Container */}
                  <div className={`relative overflow-hidden bg-[var(--color-bg)] ${isLead ? 'h-64 sm:h-80 md:h-96' : 'h-52 sm:h-60'}`}>
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/30 to-transparent" />

                    {/* Unboxed Metadata in Media Banner */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--color-bg)]/80 backdrop-blur-sm border border-[var(--color-border)] text-[#cbc3d7]">
                        <span>{project.category}</span>
                        <span className="text-[#71717a]">·</span>
                        <span>{project.year}</span>
                      </div>
                      {project.featured && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-primary)]/20 backdrop-blur-sm border border-[var(--color-primary)]/40 text-[var(--color-primary)]">
                          <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                          <span className="text-[11px] font-medium">{copy.featuredBadge}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                          {project.title}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-border)] group-hover:border-[var(--color-primary)] flex items-center justify-center text-[#a1a1aa] group-hover:text-[var(--color-primary)] shrink-0 transition-colors">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#a1a1aa] line-clamp-2 mb-4 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div>
                      {/* Metric & Unboxed Tags */}
                      <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-mono flex-wrap">
                          {project.tags.slice(0, 3).map((tag, tIndex) => (
                            <React.Fragment key={tag}>
                              <span className="text-[#a1a1aa]">{tag}</span>
                              {tIndex < Math.min(2, project.tags.length - 1) && <span>·</span>}
                            </React.Fragment>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-[#71717a]">+{project.tags.length - 3}</span>
                          )}
                        </div>

                        {project.metrics && (
                          <span className="font-mono text-xs font-semibold text-[var(--color-secondary)] tabular-nums">
                            {project.metrics}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
