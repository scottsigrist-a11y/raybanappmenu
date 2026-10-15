import { RayBanApp, HudColorTheme, DEFAULT_CATEGORIES } from '../types/app';
import { DEFAULT_APPS } from '../data/defaultApps';

const STORAGE_KEY_APPS = 'rayban_launcher_apps_v1';
const STORAGE_KEY_THEME = 'rayban_launcher_theme_v1';
const STORAGE_KEY_CATEGORIES = 'rayban_launcher_categories_v1';
const SYNC_CHANNEL_NAME = 'rayban_apps_sync_channel';

let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch {
  syncChannel = null;
}

export function loadApps(): RayBanApp[] {
  if (typeof window === 'undefined') return DEFAULT_APPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPS);
    if (!raw) {
      saveApps(DEFAULT_APPS);
      return DEFAULT_APPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_APPS;
  } catch (err) {
    console.warn('Failed to load apps from storage, defaulting:', err);
    return DEFAULT_APPS;
  }
}

export function saveApps(apps: RayBanApp[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'APPS_UPDATED', apps });
    }
  } catch (err) {
    console.error('Failed to save apps to storage:', err);
  }
}

export function subscribeToAppsUpdates(callback: (apps: RayBanApp[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === 'APPS_UPDATED' && Array.isArray(event.data.apps)) {
      callback(event.data.apps);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY_APPS && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch {
        // ignore JSON errors
      }
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}

export function loadCategories(): string[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'CATEGORIES_UPDATED', categories });
    }
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function subscribeToCategoriesUpdates(callback: (categories: string[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === 'CATEGORIES_UPDATED' && Array.isArray(event.data.categories)) {
      callback(event.data.categories);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY_CATEGORIES && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch {
        // ignore
      }
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}

export function loadTheme(): HudColorTheme {
  if (typeof window === 'undefined') return 'emerald';
  try {
    const theme = localStorage.getItem(STORAGE_KEY_THEME) as HudColorTheme;
    if (theme && ['emerald', 'monochrome', 'cyan', 'amber'].includes(theme)) {
      return theme;
    }
  } catch {
    // fallback
  }
  return 'emerald';
}

export function saveTheme(theme: HudColorTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (syncChannel) {
      syncChannel.postMessage({ type: 'THEME_UPDATED', theme });
    }
  } catch {
    // ignore
  }
}

export function subscribeToThemeUpdates(callback: (theme: HudColorTheme) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === 'THEME_UPDATED' && event.data.theme) {
      callback(event.data.theme);
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
  };
}
