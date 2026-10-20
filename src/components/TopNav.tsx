// src/components/TopNav.tsx
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Github, Menu, X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { getStoredTheme, setStoredTheme, getCompletedLessons } from '../utils/storage';

interface TopNavProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenPractice: () => void;
  totalLessons: number;
  sidebarOpen: boolean;
  activeView: string;
  onNavigateHome: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenPractice,
  totalLessons,
  sidebarOpen,
  activeView,
  onNavigateHome
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme);
  const [completedCount, setCompletedCount] = useState<number>(() => getCompletedLessons().length);

  useEffect(() => {
    const handleProgressChange = () => {
      setCompletedCount(getCompletedLessons().length);
    };
    window.addEventListener('mlvault-progress-changed', handleProgressChange);
    return () => window.removeEventListener('mlvault-progress-changed', handleProgressChange);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
  };

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 flex items-center justify-between gap-3">
        {/* Left: Mobile menu toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-xs border border-slate-700/50 group-hover:border-sky-500 transition-colors">
              <span className="font-mono font-bold text-sky-400 text-sm">ML</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MLVault
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-medium">
                  v1.0
                </span>
              </div>
              <div className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                Jupyter Study Workspace
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Button (Cmd+K style) */}
        <div className="flex-1 max-w-md mx-1 sm:mx-6 min-w-0">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/90 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs transition-all group"
            aria-label="Search study hub"
          >
            <span className="flex items-center gap-2 truncate">
              <Search size={14} className="group-hover:text-sky-500 transition-colors flex-shrink-0" />
              <span className="hidden sm:inline truncate">Search lessons, formulas, code...</span>
              <span className="inline sm:hidden truncate">Search...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs flex-shrink-0">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Quick actions, Progress, Theme, GitHub */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Quick Practice / Revision Button (Mobile Icon) */}
          <button
            onClick={onOpenPractice}
            className={`flex md:hidden p-2 rounded-lg text-xs font-semibold transition-colors ${
              activeView === 'practice'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Quick Revision & Q&A"
            aria-label="Quick Revision & Q&A"
          >
            <Sparkles size={16} className={activeView === 'practice' ? 'text-white' : 'text-amber-500'} />
          </button>

          {/* Quick Practice / Revision Button (Desktop text pill) */}
          <button
            onClick={onOpenPractice}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeView === 'practice'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Quick Revision & Q&A</span>
          </button>

          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
              {completedCount}/{totalLessons} ({progressPercent}%)
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/codexshami/MLVault"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="GitHub: codexshami/MLVault"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};
