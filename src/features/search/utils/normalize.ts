const isPureASCII = /^[a-zA-Z0-9\s\-_:#().]+$/;

/**
 * Normalizes a string by converting it to lowercase and removing accents/diacritics.
 * Optimized to skip heavy Unicode normalization for pure ASCII strings.
 */
export function normalizeString(str: string): string {
  const lowercase = str.toLowerCase();
  if (isPureASCII.test(str)) {
    return lowercase;
  }
  return lowercase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
