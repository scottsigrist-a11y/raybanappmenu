/**
 * Utility to extract domain and retrieve high-resolution favicons for web applications
 */

export function extractDomain(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('builtin:')) return null;

  try {
    let normalized = trimmed;
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }
    const parsed = new URL(normalized);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return null;
    }
    return parsed.hostname;
  } catch {
    return null;
  }
}

export function getFaviconUrl(url: string, size = 128): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;
  // Google's reliable s2 favicon API serves crisp 128px icons without CORS issues for <img>
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}
