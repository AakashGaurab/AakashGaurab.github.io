import { Terminal, Github, Linkedin, Mail, ArrowUp, Download } from "lucide-react";
import { Link } from "../../context/RouterContext";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { SITE_CONFIG } from "../../config/site.config";
import { trackResumeDownload } from "../../services/analytics";

export function Footer() {
  const { persona, visibleNav } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const { footer, features, resume } = SITE_CONFIG;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[var(--color-bg)] border-t border-[var(--color-border)] text-[#a1a1aa] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-display">{persona.name}</span>
            </div>
            {persona.bio && (
              <p className="text-xs text-[#a1a1aa] max-w-md leading-relaxed">
                {persona.bio}
              </p>
            )}
            {persona.availabilityText && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary)]">
                  <span className={`w-1.5 h-1.5 rounded-full ${persona.isAvailable ? "bg-[var(--color-secondary)] animate-pulse" : "bg-[#a1a1aa]"}`} />
                  <span className="font-mono">{persona.availabilityText}</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] mb-3">
              {footer.navHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              {visibleNav.map((item) => (
                <li key={item.sectionId}>
                  <a
                    href={`#${item.sectionId}`}
                    className="hover:text-[#f4f4f5] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {(features.showAdminLinks || isAuthenticated) && (
                <li>
                  <Link
                    to="/admin"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* External Links & Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] mb-3">
              {footer.linksHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              {persona.githubUrl && (
                <li>
                  <a
                    href={persona.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-[#f4f4f5] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>{footer.githubLabel}</span>
                  </a>
                </li>
              )}
              {persona.linkedinUrl && (
                <li>
                  <a
                    href={persona.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-[#f4f4f5] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>{footer.linkedinLabel}</span>
                  </a>
                </li>
              )}
              {persona.contactEmail && (
                <li>
                  <a
                    href={`mailto:${persona.contactEmail}`}
                    className="flex items-center gap-2 hover:text-[#f4f4f5] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{persona.contactEmail}</span>
                  </a>
                </li>
              )}
              {resume.file && (
                <li>
                  <a
                    href={resume.file}
                    download={resume.downloadName}
                    onClick={() => trackResumeDownload("footer")}
                    className="flex items-center gap-2 hover:text-[#f4f4f5] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{resume.mobileLabel}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
          <p>
            © {new Date().getFullYear()} {persona.name}. {footer.builtWith}
          </p>
          <div className="flex items-center gap-4">
            {footer.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors ml-2"
            >
              <span>{footer.backToTop}</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
