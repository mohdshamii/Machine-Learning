// src/components/TableOfContents.tsx
import React, { useState, useEffect } from 'react';
import { HeadingItem } from '../types';
import { Bookmark, CheckCircle2, Share2, Clock, Award, Check, BookOpen } from 'lucide-react';
import { toggleLessonCompleted, toggleBookmark } from '../utils/storage';

interface TableOfContentsProps {
  headings: HeadingItem[];
  lessonId: string;
  difficulty?: string;
  estimatedMinutes?: number;
  prerequisites?: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
  onStatusChange: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  lessonId,
  difficulty = 'Intermediate',
  estimatedMinutes = 10,
  prerequisites = [],
  isCompleted,
  isBookmarked,
  onStatusChange
}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll spy to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(headings[i].id);
          return;
        }
      }
      if (headings[0]) {
        setActiveHeadingId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, lessonId]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmark(lessonId);
    onStatusChange();
  };

  const handleToggleCompleted = () => {
    toggleLessonCompleted(lessonId);
    onStatusChange();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="toc-container w-64 space-y-5 text-xs text-slate-600 dark:text-slate-400">
      {/* Lesson Meta Card & Actions */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <Clock size={13} className="text-sky-500" />
            <span>{estimatedMinutes} min read</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
            {difficulty}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          {/* Mark Complete */}
          <button
            onClick={handleToggleCompleted}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-xs transition-colors shadow-2xs ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 size={14} className={isCompleted ? 'text-white' : 'text-emerald-500'} />
            <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
          </button>

          {/* Bookmark & Share row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium text-xs border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark size={13} className={isBookmarked ? 'text-amber-500 fill-amber-500' : ''} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Prerequisites */}
        {prerequisites && prerequisites.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Prerequisites
            </span>
            <div className="flex flex-wrap gap-1">
              {prerequisites.map((pre, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                >
                  {pre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table of Contents Section */}
      {headings.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
            <BookOpen size={12} />
            <span>On This Page</span>
          </div>

          <nav className="space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
            {headings.map((h) => {
              const isActive = activeHeadingId === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => scrollToHeading(h.id)}
                  className={`block text-left text-xs transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${
                    h.level === 1
                      ? 'font-semibold text-slate-900 dark:text-slate-200'
                      : h.level === 2
                      ? 'pl-2 text-slate-700 dark:text-slate-300'
                      : 'pl-4 text-slate-500 dark:text-slate-400'
                  } ${isActive ? 'text-sky-600 dark:text-sky-400 font-semibold border-l-2 -ml-[13px] pl-3 border-sky-600' : ''}`}
                >
                  {h.title}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
