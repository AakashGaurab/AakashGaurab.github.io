import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { SITE_CONFIG } from '../config/site.config';
import { isFirebaseEnabled } from '../services/firebase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Terminal, Key } from 'lucide-react';

export function LoginPage() {
  const { login, isAuthenticated, authError, clearError, isLoading } = useAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please input both administrative email and password.');
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      navigate('/admin');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('admin@obsidian.studio');
    setPassword('obsidian2026');
    setLocalError('');
    clearError();
    const success = await login('admin@obsidian.studio', 'obsidian2026');
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[var(--color-bg)] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Lockup */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-container)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base block">{SITE_CONFIG.persona.name}</span>
              <span className="text-[11px] font-mono text-[#71717a]">Administrative Console</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[var(--color-secondary)] bg-[var(--color-surface-container)] border border-[var(--color-border)]">
            SSL Secured
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold font-display text-white">
            Sign In to Studio Admin
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Authenticate to manage portfolio exhibits, review inquiries, and monitor telemetry.
          </p>
        </div>

        {/* Error Feedback */}
        {(localError || authError) && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#2b161b] border border-[#ffb4ab]/30 flex items-start gap-2.5 text-xs text-[#ffb4ab]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Demo Helper Banner (mock login only; Firebase Auth has real accounts) */}
        {!isFirebaseEnabled && (
          <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[#d0bcff] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                Quick Evaluation Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-[11px] font-semibold text-[var(--color-primary)] hover:text-[#d0bcff] hover:underline cursor-pointer"
              >
                One-Click Login
              </button>
            </div>
            <div className="text-[11px] text-[#71717a] font-mono space-y-0.5">
              <div>Email: <span className="text-[#f4f4f5]">admin@obsidian.studio</span></div>
              <div>Password: <span className="text-[#f4f4f5]">obsidian2026</span></div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#cbc3d7] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@obsidian.studio"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#cbc3d7]">
                Password
              </label>
              <span className="text-[11px] text-[#71717a]">Minimum 4 characters</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_0_16px_-2px_color-mix(in_srgb,var(--color-primary)_45%,transparent)] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center">
          <Link
            to="/"
            className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
