/**
 * Lightweight i18n helper for theme JS.
 * Prefers Salla's `salla.lang.get(key)` when available, otherwise falls back.
 *
 * @param {string} key
 * @param {string|Record<string,string>} fallback
 * @returns {string}
 */
export function t(key, fallback = "") {
  try {
    // Prefer Salla language system (theme locales are compiled into it)
    if (typeof window !== "undefined" && window.salla?.lang?.get) {
      const value = window.salla.lang.get(key);
      // Some i18n libs return the key when missing; treat that as "not found".
      if (value && value !== key) return value;
    }
  } catch (e) {
    // ignore and fallback
  }

  const lang =
    (typeof window !== "undefined" && window.languageCode) ||
    (typeof document !== "undefined" && document.documentElement?.lang) ||
    "ar";

  if (fallback && typeof fallback === "object") {
    return fallback[lang] || fallback.ar || fallback.en || Object.values(fallback)[0] || key;
  }

  return fallback || key;
}

