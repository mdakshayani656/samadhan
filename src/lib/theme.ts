export type ThemeMode = 'light' | 'dark';
export type FontSizeScale = 'small' | 'normal' | 'large' | 'larger';
export type PortalLanguage = 'en' | 'hi';

export interface ThemeSettings {
  theme: ThemeMode;
  font: string;
  fontSize: FontSizeScale;
  language: PortalLanguage;
}

export const AVAILABLE_FONTS = [
  { id: 'outfit', name: 'Outfit (Modern Civic Display)', cssValue: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', cssValue: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'system', name: 'System Default Sans', cssValue: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
];

const THEME_STORAGE_KEY = 'samadhan_theme_mode';
const FONT_STORAGE_KEY = 'samadhan_active_font';
const FONT_SIZE_STORAGE_KEY = 'samadhan_font_size';
const LANG_STORAGE_KEY = 'samadhan_portal_language';

export function getTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function getFont(): string {
  if (typeof window === 'undefined') return 'outfit';
  return localStorage.getItem(FONT_STORAGE_KEY) || 'outfit';
}

export function getFontSize(): FontSizeScale {
  if (typeof window === 'undefined') return 'normal';
  const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizeScale;
  if (saved === 'small' || saved === 'normal' || saved === 'large' || saved === 'larger') {
    return saved;
  }
  return 'normal';
}

export function getLanguage(): PortalLanguage {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as PortalLanguage;
  if (saved === 'en' || saved === 'hi') {
    return saved;
  }
  return 'en';
}

export function applyTheme(
  theme: ThemeMode,
  fontId: string = getFont(),
  fontSize: FontSizeScale = getFontSize(),
  language: PortalLanguage = getLanguage()
): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const selectedFont = AVAILABLE_FONTS.find((f) => f.id === fontId) || AVAILABLE_FONTS[0];
  root.style.setProperty('--samadhan-font', selectedFont.cssValue);
  document.body.style.fontFamily = selectedFont.cssValue;

  // Real accessibility zoom scaling
  const scaleMap: Record<FontSizeScale, string> = {
    small: '90%',
    normal: '100%',
    large: '110%',
    larger: '120%'
  };
  root.style.fontSize = scaleMap[fontSize] || '100%';

  window.dispatchEvent(
    new CustomEvent('samadhan_theme_changed', {
      detail: { theme, font: fontId, fontSize, language }
    })
  );
}

export function setTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme, getFont(), getFontSize(), getLanguage());
}

export function toggleTheme(): ThemeMode {
  const current = getTheme();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function setFont(fontId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FONT_STORAGE_KEY, fontId);
  applyTheme(getTheme(), fontId, getFontSize(), getLanguage());
}

export function setFontSize(size: FontSizeScale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
  applyTheme(getTheme(), getFont(), size, getLanguage());
}

export function setLanguage(lang: PortalLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyTheme(getTheme(), getFont(), getFontSize(), lang);
}

export function toggleLanguage(): PortalLanguage {
  const next = getLanguage() === 'en' ? 'hi' : 'en';
  setLanguage(next);
  return next;
}

export function subscribeToTheme(callback: (settings: ThemeSettings) => void): () => void {
  const handler = () => {
    callback({
      theme: getTheme(),
      font: getFont(),
      fontSize: getFontSize(),
      language: getLanguage()
    });
  };

  window.addEventListener('samadhan_theme_changed', handler);
  callback({
    theme: getTheme(),
    font: getFont(),
    fontSize: getFontSize(),
    language: getLanguage()
  });

  return () => window.removeEventListener('samadhan_theme_changed', handler);
}

if (typeof window !== 'undefined') {
  applyTheme(getTheme(), getFont(), getFontSize(), getLanguage());

  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const explicit = localStorage.getItem(THEME_STORAGE_KEY);
      if (!explicit) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  } catch {
    // Ignore unsupported matchMedia
  }
}
