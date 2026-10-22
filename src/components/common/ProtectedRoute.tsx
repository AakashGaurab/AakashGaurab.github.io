import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from '../../context/RouterContext';
import { isFirebaseEnabled } from '../../services/firebase';
import { Lock, ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-[#a1a1aa]">Verifying studio authorization token...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle violet ambient backlight */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] mb-6 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#ffb4ab] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Restricted Route / Access Denied
            </span>
          </div>

          <h2 className="text-2xl font-bold font-display text-[#f4f4f5] mb-3">
            Admin Authentication Required
          </h2>

          <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">
            The studio administrative environment is guarded by authentication. You must sign in with verified studio credentials before accessing project management, live messages, and telemetry controls.
          </p>

          {!isFirebaseEnabled && (
            <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] mb-6 text-xs text-[#a1a1aa] space-y-1">
              <div className="flex items-center justify-between text-[#e2e0fa] font-mono font-medium">
                <span>Demo Login Available</span>
                <span className="text-[var(--color-secondary)]">Quick Auth</span>
              </div>
              <p className="text-[11px] text-[#71717a]">
                Email: <code className="text-[#d0bcff]">admin@obsidian.studio</code> · Pass: <code className="text-[#d0bcff]">obsidian2026</code>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:flex-1 py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Go to Login Screen</span>
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto py-2.5 px-4 bg-[var(--color-surface-container)] hover:bg-[#28283b] text-[#e2e0fa] border border-[var(--color-border)] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
