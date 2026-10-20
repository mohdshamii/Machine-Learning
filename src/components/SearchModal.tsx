// src/components/SearchModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { LessonSummary, Subject } from '../types';
import { Search, X, FileCode, BookOpen, FileText, CornerDownLeft, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allLessons: LessonSummary[];
  subjects: Subject[];
  onSelectLesson: (lessonId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allLessons,
  subjects,
  onSelectLesson
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter lessons based on search query
  const searchResults = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allLessons.slice(0, 10); // Show top 10 recommended by default

    return allLessons
      .filter((lesson) => {
        const titleMatch = lesson.title.toLowerCase().includes(q);
        const descMatch = lesson.description.toLowerCase().includes(q);
        const tagMatch = lesson.tags.some((t) => t.toLowerCase().includes(q));
        const tokenMatch = lesson.searchTokens?.toLowerCase().includes(q);
        return titleMatch || descMatch || tagMatch || tokenMatch;
      })
      .slice(0, 20);
  }, [query, allLessons]);

  // Keyboard navigation inside modal
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        onSelectLesson(selected.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyNavigation}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all lessons, algorithms, notes, formulas..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const subject = subjects.find((s) => s.id === item.subjectId);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectLesson(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {item.format === 'notebook' ? (
                        <FileCode size={14} className="text-sky-600 dark:text-sky-400" />
                      ) : item.format === 'pdf' ? (
                        <FileText size={14} className="text-rose-500" />
                      ) : (
                        <BookOpen size={14} className="text-emerald-500" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {subject?.title || item.subjectId}
                        </span>
                        {item.difficulty && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {item.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.description}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {item.tags.slice(0, 4).map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium flex-shrink-0 self-center">
                      <span>Select</span>
                      <CornerDownLeft size={12} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <Sparkles size={28} className="mx-auto text-slate-400" />
              <p className="text-sm font-medium">No learning materials found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400">
                Try searching for keywords like &ldquo;gradient descent&rdquo;, &ldquo;clustering&rdquo;, &ldquo;titanic&rdquo;, or &ldquo;normal equation&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded">
                ↑
              </kbd>{' '}
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded">
                ENTER
              </kbd>{' '}
              Open
            </span>
          </div>
          <span>{searchResults.length} results</span>
        </div>
      </div>
    </div>
  );
};
