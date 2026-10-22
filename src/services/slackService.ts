// Forwards contact-form submissions to a Slack incoming webhook.
//
// NOTE: this runs in the browser, so the webhook URL is visible to anyone who
// inspects the built JS. Keep it in .env.local (git-ignored), and regenerate it
// in Slack if it gets abused.
const WEBHOOK_URL: string | undefined = import.meta.env.VITE_SLACK_WEBHOOK_URL;

export interface ContactNotification {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Slack treats &, < and > as control characters (links, @channel mentions).
const escapeSlack = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function isSlackConfigured(): boolean {
  return Boolean(WEBHOOK_URL);
}

export async function notifySlack({ name, email, subject, message }: ContactNotification): Promise<void> {
  if (!WEBHOOK_URL) return;

  const payload = {
    text: `New portfolio message from ${escapeSlack(name)}: ${escapeSlack(subject)}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*New portfolio message*\n*${escapeSlack(subject)}*` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From*\n${escapeSlack(name)}` },
          { type: 'mrkdwn', text: `*Email*\n${escapeSlack(email)}` }
        ]
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: escapeSlack(message).slice(0, 2900) }
      }
    ]
  };

  // Slack webhooks don't answer CORS preflights, so send a "simple" form-encoded
  // request in no-cors mode. The response is opaque: only network failures reject.
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ payload: JSON.stringify(payload) })
  });
}
