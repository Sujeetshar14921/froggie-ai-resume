/**
 * Froggie Cookie & Privacy Consent Utility
 * Provides GDPR / CCPA compliant cookie preference management
 */

export const COOKIE_STORAGE_KEY = "froggie_cookie_preferences";
export const COOKIE_CONSENT_KEY = "froggie_cookie_consented";

export const DEFAULT_COOKIE_PREFERENCES = {
  essential: true, // Required for login sessions, CSRF, security & theme
  analytics: true, // Anonymous ATS scanner performance & page telemetry
  personalization: true, // Copilot AI prompt caching & custom workspace preferences
  marketing: false, // Optional recruiter network & talent discovery insights
};

export const hasConsentedToCookies = () => {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
  } catch {
    return false;
  }
};

export const getCookiePreferences = () => {
  try {
    const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!saved) return DEFAULT_COOKIE_PREFERENCES;
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_COOKIE_PREFERENCES,
      ...parsed,
      essential: true, // Always enforced
    };
  } catch {
    return DEFAULT_COOKIE_PREFERENCES;
  }
};

export const saveCookiePreferences = (preferences) => {
  try {
    const payload = {
      ...DEFAULT_COOKIE_PREFERENCES,
      ...preferences,
      essential: true, // Strictly mandatory
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(COOKIE_CONSENT_KEY, new Date().toISOString());

    // Dispatch global event for reactive UI updates
    window.dispatchEvent(
      new CustomEvent("froggie:cookie-consent-changed", {
        detail: payload,
      })
    );

    return payload;
  } catch (err) {
    console.error("Failed to save cookie preferences:", err);
    return DEFAULT_COOKIE_PREFERENCES;
  }
};

export const acceptAllCookies = () => {
  return saveCookiePreferences({
    essential: true,
    analytics: true,
    personalization: true,
    marketing: true,
  });
};

export const acceptNecessaryCookiesOnly = () => {
  return saveCookiePreferences({
    essential: true,
    analytics: false,
    personalization: false,
    marketing: false,
  });
};

export const resetCookieConsent = () => {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("froggie:cookie-consent-changed", { detail: null }));
  } catch (err) {
    console.error("Failed to reset cookie consent:", err);
  }
};
