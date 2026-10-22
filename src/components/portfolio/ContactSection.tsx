import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Send, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site.config';

export function ContactSection() {
  const { sendMessage, persona } = usePortfolio();
  const copy = SITE_CONFIG.contact;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage(copy.validationError);
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await sendMessage(name.trim(), email.trim(), subject.trim() || copy.defaultSubject, message.trim());
      setSubmitStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMessage(copy.sendError);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[var(--color-bg)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>{copy.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="text-sm text-[#cbc3d7] leading-relaxed">
              {copy.subtitle}
            </p>

            <div className="space-y-4 pt-4 border-t border-[var(--color-border)] text-xs">
              {copy.details.map((detail) => (
                <div key={detail} className="flex items-center gap-3 text-[#a1a1aa]">
                  <Clock className="w-4 h-4 text-[var(--color-secondary)]" />
                  <span>{detail}</span>
                </div>
              ))}
              {persona.location && (
                <div className="flex items-center gap-3 text-[#a1a1aa]">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Based in {persona.location}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <span className="text-[11px] font-mono text-[#71717a] block uppercase">{copy.emailLabel}</span>
              <a
                href={`mailto:${persona.contactEmail}`}
                className="text-sm font-mono font-medium text-[var(--color-primary)] hover:underline"
              >
                {persona.contactEmail}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold font-display text-white mb-6">
                {copy.formTitle}
              </h3>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-secondary)]/40 flex items-start gap-3 text-xs text-[#f4f4f5]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">{copy.successTitle}</strong>
                    <span>{copy.successText}</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-[#2b161b] border border-[#ffb4ab]/40 flex items-start gap-3 text-xs text-[#ffb4ab]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1.5">
                      {copy.nameLabel} <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={copy.namePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#cbc3d7] mb-1.5">
                      {copy.emailFieldLabel} <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#cbc3d7] mb-1.5">
                    {copy.subjectLabel}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={copy.subjectPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#cbc3d7] mb-1.5">
                    {copy.messageLabel} <span className="text-[var(--color-primary)]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={copy.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-lg text-xs text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-y"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>{copy.submittingLabel}</span>
                    ) : (
                      <>
                        <span>{copy.submitLabel}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
