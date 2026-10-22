import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, RotateCcw, SendHorizontal, X } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site.config';
import { trackEvent } from '../../services/analytics';
import { usePortfolio } from '../../context/PortfolioContext';
import { ChatLimitError, isChatConfigured, streamAssistantReply, type ChatTurn } from '../../services/chatService';

interface ChatMessage extends ChatTurn {
  id: number;
  isError?: boolean;
}

const copy = SITE_CONFIG.chat;
const greeting = (): ChatMessage => ({ id: 0, role: 'model', text: copy.greeting });

// Turns **bold** / *bold*, URLs and emails in a reply into elements.
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

function renderInline(text: string) {
  return text.split(INLINE_PATTERN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <strong key={i} className="font-semibold text-white">{part.slice(1, -1)}</strong>;
    if (/^https?:\/\//.test(part) || /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      const href = part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part;
      return (
        <a key={i} href={href} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline underline-offset-2 break-all">
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// Lines starting with "- " or "* " become a bullet list; everything else a paragraph.
function renderReply(text: string) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={blocks.length} className="list-disc pl-4 space-y-1">
        {bullets.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
      </ul>
    );
    bullets = [];
  };
  for (const line of text.split('\n')) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{renderInline(line)}</p>);
  }
  flush();
  return blocks;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3" aria-label="Assistant is typing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  // The assistant answers from the same live content the site shows.
  const { persona, projects, skills, experience } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting()]);
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);
  const abortRef = useRef<AbortController | null>(null);

  // Stop a reply that is still streaming if the widget goes away.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isGenerating, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || isGenerating) return;
    // Counts messages only; the text itself is never sent to analytics.
    trackEvent('chat_message', { is_suggestion: copy.suggestions.includes(text) ? 1 : 0 });

    // Prior turns go to Gemini as context; the greeting and failed replies are left out.
    const history = messages.filter((m) => m.id !== 0 && !m.isError).map(({ role, text }) => ({ role, text }));
    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text }]);
    setDraft('');
    requestAnimationFrame(resizeInput);
    setIsGenerating(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const replyId = nextId.current++;
    // Fill one reply bubble in place as chunks stream in.
    const showReply = (reply: string, isError = false) =>
      setMessages((prev) => {
        const others = prev.filter((m) => m.id !== replyId);
        return [...others, { id: replyId, role: 'model', text: reply, isError }];
      });

    try {
      await streamAssistantReply(text, history, { persona, projects, skills, experience }, (soFar) => showReply(soFar), controller.signal);
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error(error);
      showReply(error instanceof ChatLimitError ? copy.limitText : copy.errorText, true);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsGenerating(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds a new line.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(draft);
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setMessages([greeting()]);
    setDraft('');
    inputRef.current?.focus();
  };

  if (!copy.enabled || !isChatConfigured()) return null;

  const showSuggestions = messages.length === 1 && !isGenerating;
  // Show the typing dots only until the first streamed words arrive.
  const isWaitingForFirstChunk = isGenerating && messages[messages.length - 1]?.role === 'user';

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-label={copy.title}
          className="chat-panel-enter fixed z-[60] inset-x-3 top-3 bottom-3 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100dvh-8rem)] flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] origin-bottom-right"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-container)]">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{copy.title}</p>
              <p className="flex items-center gap-1.5 text-[11px] font-mono text-[#a1a1aa]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                {copy.status}
              </p>
            </div>
            <button
              onClick={handleReset}
              title={copy.resetLabel}
              aria-label={copy.resetLabel}
              className="p-2 text-[#a1a1aa] hover:text-white hover:bg-[var(--color-surface)] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title={copy.closeLabel}
              aria-label={copy.closeLabel}
              className="p-2 text-[#a1a1aa] hover:text-white hover:bg-[var(--color-surface)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 bg-[var(--color-bg)]">
            <div className="flex flex-col items-center gap-2 pt-2 pb-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 flex items-center justify-center text-[var(--color-primary)]">
                <Bot className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-[#e2e0fa]">{copy.title}</p>
            </div>

            {messages.map((msg) =>
              msg.role === 'user' ? (
                <div key={msg.id} className="flex justify-end">
                  <p className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-br-sm bg-[var(--color-primary)] text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="flex items-end gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    A
                  </span>
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl rounded-bl-sm border text-sm leading-relaxed break-words space-y-2 ${
                      msg.isError
                        ? 'bg-red-500/10 border-red-500/30 text-red-200'
                        : 'bg-[var(--color-surface-container)] border-[var(--color-border)] text-[#e2e0fa]'
                    }`}
                  >
                    {renderReply(msg.text)}
                  </div>
                </div>
              )
            )}

            {isWaitingForFirstChunk && (
              <div className="flex items-end gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  A
                </span>
                <div className="rounded-2xl rounded-bl-sm bg-[var(--color-surface-container)] border border-[var(--color-border)]">
                  <TypingDots />
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1 pl-9">
                {copy.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 text-xs text-[#e2e0fa] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-full transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(draft);
            }}
            className="flex items-end gap-2 p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={1000}
              placeholder={copy.placeholder}
              onChange={(e) => {
                setDraft(e.target.value);
                resizeInput();
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 resize-none max-h-[120px] px-3.5 py-2.5 text-base sm:text-sm text-white placeholder:text-[#71717a] bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isGenerating}
              title={copy.sendLabel}
              aria-label={copy.sendLabel}
              className="p-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Launcher (hidden on phones while the full-screen panel is open) */}
      <button
        onClick={() => {
          if (!isOpen) trackEvent('chat_open');
          setIsOpen((open) => !open);
        }}
        aria-label={isOpen ? copy.closeLabel : copy.openLabel}
        title={isOpen ? copy.closeLabel : copy.openLabel}
        className={`${isOpen ? 'hidden sm:flex' : 'flex'} fixed z-[60] bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-[0_8px_30px_-4px_color-mix(in_srgb,var(--color-primary)_60%,transparent)] transition-all hover:scale-105 cursor-pointer`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping opacity-25" />
            <MessageCircle className="relative w-6 h-6 sm:w-7 sm:h-7" />
          </>
        )}
      </button>
    </>
  );
}
