// Portfolio chat assistant: streams Gemini replies straight from the browser (the site
// is static on GitHub Pages, so there is no server to hide the key behind).
//
// NOTE: VITE_GEMINI_API_KEY is bundled into the public JS. Restrict the key in Google
// Cloud Console to this site's referrers and the Generative Language API, and give it a
// low quota. The per-visitor cap below only slows down casual misuse.
import { buildChatProfile, type ChatProfileSource } from '../data/chatProfile';

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

const API_KEY: string | undefined = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL: string = import.meta.env.VITE_GEMINI_MODEL || 'gemini-flash-lite-latest';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

const MAX_HISTORY_TURNS = 8;
const MAX_OUTPUT_TOKENS = 400;
const DAILY_LIMIT = 40;
const USAGE_KEY = 'obsidian_studio_chat_usage_v1';

// The whole profile fits comfortably in the prompt, so the model answers in a single
// request instead of calling a lookup tool first. It is rebuilt per message from the
// live site content, so admin edits apply without a redeploy.
function buildSystemInstruction(source: ChatProfileSource): string {
  const name = source.persona.name;
  const firstName = name.split(' ')[0] || name;
  return `You are the AI assistant on ${name}'s portfolio website.

Rules:
1. Answer only questions about ${firstName}: skills, experience, projects, education, certifications, availability and contact details.
2. Use only the facts in PROFILE below. If something isn't there, say you don't know and suggest contacting ${firstName}.
3. Politely decline unrelated or general-knowledge requests and steer back to ${firstName}.
4. You may share the email, phone number and social links in PROFILE when asked.
5. If someone wants the resume, tell them to use the "Resume" button in the site navigation.
6. Be professional and friendly. Reply in 1-4 short sentences or a brief bullet list. Refer to ${firstName} in the third person.

PROFILE (JSON):
${JSON.stringify(buildChatProfile(source))}`;
}

export class ChatLimitError extends Error {}

export function isChatConfigured(): boolean {
  return Boolean(API_KEY);
}

const today = () => new Date().toISOString().slice(0, 10);

// Counts this browser's messages per day. Storage can be unavailable (private mode),
// in which case the cap simply doesn't apply.
function takeDailyQuota(): boolean {
  try {
    const stored = JSON.parse(localStorage.getItem(USAGE_KEY) || 'null') as { day: string; count: number } | null;
    const usage = stored?.day === today() ? stored : { day: today(), count: 0 };
    if (usage.count >= DAILY_LIMIT) return false;
    localStorage.setItem(USAGE_KEY, JSON.stringify({ day: usage.day, count: usage.count + 1 }));
  } catch {
    // ignore
  }
  return true;
}

/**
 * Sends `message` (with recent `history` as context and `profile` as the facts to answer
 * from) and calls `onText` with the reply so far each time a new chunk arrives.
 * Resolves with the full reply.
 */
export async function streamAssistantReply(
  message: string,
  history: ChatTurn[],
  profile: ChatProfileSource,
  onText: (textSoFar: string) => void,
  signal?: AbortSignal
): Promise<string> {
  if (!API_KEY) throw new Error('Chat is not configured: set VITE_GEMINI_API_KEY.');
  if (!takeDailyQuota()) throw new ChatLimitError('Daily chat limit reached.');

  const contents = [...history.slice(-MAX_HISTORY_TURNS), { role: 'user', text: message }].map((t) => ({
    role: t.role,
    parts: [{ text: t.text }]
  }));

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemInstruction(profile) }] },
      contents,
      generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 }
    }),
    signal
  });

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error?.message || `Gemini request failed (${response.status})`);
  }

  // Server-sent events: each "data: {...}" line carries the next slice of the reply.
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  let text = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const chunk = JSON.parse(line.slice(5));
      const parts: { text?: string; thought?: boolean }[] = chunk.candidates?.[0]?.content?.parts ?? [];
      const delta = parts.filter((p) => !p.thought).map((p) => p.text ?? '').join('');
      if (delta) {
        text += delta;
        onText(text);
      }
    }
  }

  if (!text.trim()) throw new Error('The assistant returned an empty reply.');
  return text;
}
