// src/utils/storage.ts
const COMPLETED_KEY = 'mlvault_completed_lessons';
const BOOKMARKS_KEY = 'mlvault_bookmarks';
const THEME_KEY = 'mlvault_theme';
const LAST_LESSON_KEY = 'mlvault_last_lesson';

export function getCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLessonCompleted(lessonId: string): boolean {
  try {
    const list = getCompletedLessons();
    const idx = list.indexOf(lessonId);
    let isCompleted: boolean;
    if (idx >= 0) {
      list.splice(idx, 1);
      isCompleted = false;
    } else {
      list.push(lessonId);
      isCompleted = true;
    }
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('mlvault-progress-changed'));
    return isCompleted;
  } catch {
    return false;
  }
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(lessonId: string): boolean {
  try {
    const list = getBookmarks();
    const idx = list.indexOf(lessonId);
    let isBookmarked: boolean;
    if (idx >= 0) {
      list.splice(idx, 1);
      isBookmarked = false;
    } else {
      list.push(lessonId);
      isBookmarked = true;
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('mlvault-bookmarks-changed'));
    return isBookmarked;
  } catch {
    return false;
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // fallback
  }
}

export function getLastLessonId(): string | null {
  try {
    return localStorage.getItem(LAST_LESSON_KEY);
  } catch {
    return null;
  }
}

export function setLastLessonId(id: string) {
  try {
    localStorage.setItem(LAST_LESSON_KEY, id);
  } catch {
    // ignore
  }
}
