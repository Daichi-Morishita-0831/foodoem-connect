type GtagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export function trackEvent({ action, category, label, value }: GtagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Voice recording
export function trackVoiceRecordingStart() {
  trackEvent({ action: "voice_recording_start", category: "voice" });
}

export function trackVoiceRecordingComplete(durationSeconds: number) {
  trackEvent({
    action: "voice_recording_complete",
    category: "voice",
    value: durationSeconds,
  });
}

// AI structurize
export function trackAiStructurizeComplete() {
  trackEvent({ action: "ai_structurize_complete", category: "ai" });
}

// Matching
export function trackMatchResultsViewed(matchCount: number) {
  trackEvent({
    action: "match_results_viewed",
    category: "matching",
    value: matchCount,
  });
}

// Inquiry
export function trackInquirySent() {
  trackEvent({ action: "inquiry_sent", category: "inquiry" });
}

// Message
export function trackMessageSent() {
  trackEvent({ action: "message_sent", category: "messaging" });
}

// Review
export function trackReviewSubmitted(rating: number) {
  trackEvent({
    action: "review_submitted",
    category: "review",
    value: rating,
  });
}

// OEM profile
export function trackOemProfileViewed(oemId: string) {
  trackEvent({
    action: "oem_profile_viewed",
    category: "oem",
    label: oemId,
  });
}

// Registration
export function trackRegistrationComplete(role: string) {
  trackEvent({
    action: "registration_complete",
    category: "auth",
    label: role,
  });
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
