// Custom Google Analytics 4 events. gtag is only on the page in production builds
// (see googleAnalyticsPlugin in vite.config.ts), so these are no-ops in dev.

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, string | number>) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number>): void {
  window.gtag?.('event', name, params);
}

/** Where on the page a resume download was started. */
export type ResumeLinkLocation = 'navbar' | 'navbar_mobile' | 'mobile_menu' | 'footer';

export const trackResumeDownload = (location: ResumeLinkLocation) =>
  trackEvent('resume_download', { link_location: location });
