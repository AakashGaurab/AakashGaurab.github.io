import React, { useState } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG } from '../../config/site.config';
import { trackResumeDownload } from '../../services/analytics';
import { Menu, X, Shield, LogOut, ArrowUpRight, Terminal, Download } from 'lucide-react';

export function Navbar() {
  const { path, navigate } = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { persona, visibleNav } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPortfolio = path === '/' || path === '';
  // Admin controls stay visible once signed in (e.g. after visiting /admin directly).
  const showAdmin = SITE_CONFIG.features.showAdminLinks || isAuthenticated;
  const { resume } = SITE_CONFIG;

  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (!isPortfolio) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-border)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#f4f4f5] hover:text-[var(--color-primary)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-colors shadow-inner">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-display font-bold">{persona.name}</span>
          </Link>
          {persona.availabilityText && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-secondary)]">
              <span className={`w-1.5 h-1.5 rounded-full ${persona.isAvailable ? 'bg-[var(--color-secondary)] animate-pulse' : 'bg-[#a1a1aa]'}`} />
              <span className="font-mono">{persona.availabilityText}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (single-line, hover subtle) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#a1a1aa]">
          {visibleNav.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => handleScrollTo(item.sectionId)}
              className="hover:text-[#f4f4f5] transition-colors whitespace-nowrap cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          {showAdmin && (
            <Link
              to="/admin"
              className={`transition-colors whitespace-nowrap flex items-center gap-1 ${
                path === '/admin' ? 'text-[var(--color-primary)] font-semibold' : 'hover:text-[#f4f4f5]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden md:flex items-center gap-3">
          {resume.file && (
            <a
              href={resume.file}
              download={resume.downloadName}
              onClick={() => trackResumeDownload('navbar')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg shadow-sm hover:shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{resume.label}</span>
            </a>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#e2e0fa] bg-[var(--color-surface-container)] border border-[var(--color-border-strong)] rounded-lg hover:border-[var(--color-primary)] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                <span className="truncate max-w-[110px]">{user?.name || 'Admin'}</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[var(--color-surface)] rounded-lg transition-colors border border-transparent hover:border-[var(--color-border)]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            showAdmin && (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg shadow-sm hover:shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] transition-all whitespace-nowrap"
              >
                <span>Admin Access</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {resume.file && (
            <a
              href={resume.file}
              download={resume.downloadName}
              onClick={() => trackResumeDownload('navbar_mobile')}
              aria-label={resume.mobileLabel}
              title={resume.mobileLabel}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span className="hidden min-[400px]:inline">{resume.label}</span>
            </a>
          )}
          {showAdmin && (
            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className="px-2.5 py-1 text-xs font-medium text-[#e2e0fa] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md"
            >
              {isAuthenticated ? 'Admin' : 'Login'}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="p-2 text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 pt-3 pb-6 space-y-3">
          {visibleNav.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => handleScrollTo(item.sectionId)}
              className="block w-full text-left py-2 text-sm text-[#e2e0fa] hover:text-white"
            >
              {item.label}
            </button>
          ))}
          {resume.file && (
            <a
              href={resume.file}
              download={resume.downloadName}
              onClick={() => {
                trackResumeDownload('mobile_menu');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg"
            >
              <Download className="w-4 h-4" />
              {resume.mobileLabel}
            </a>
          )}
          {showAdmin && (
            <div className="pt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm text-[var(--color-primary)] bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                  Admin Dashboard
                </span>
                <span className="text-xs text-[var(--color-secondary)]">Protected</span>
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 text-xs text-[#a1a1aa] hover:text-white border border-[var(--color-border)] rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out ({user?.email})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-lg"
                >
                  Sign In to Admin
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
