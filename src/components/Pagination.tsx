// src/components/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, FileCode, BookOpen, FileText } from 'lucide-react';
import { LessonSummary } from '../types';

interface PaginationProps {
  prevLesson?: LessonSummary;
  nextLesson?: LessonSummary;
  onSelectLesson: (lessonId: string) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  prevLesson,
  nextLesson,
  onSelectLesson
}) => {
  if (!prevLesson && !nextLesson) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 mt-12 border-t border-slate-200 dark:border-slate-800">
      {/* Previous Lesson */}
      {prevLesson ? (
        <button
          onClick={() => {
            onSelectLesson(prevLesson.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-sky-400 dark:hover:border-sky-600 text-left transition-all group shadow-2xs"
        >
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-50 dark:group-hover:bg-sky-950 group-hover:text-sky-600 transition-colors">
            <ChevronLeft size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Previous Lesson
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {prevLesson.title}
            </div>
          </div>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Lesson */}
      {nextLesson ? (
        <button
          onClick={() => {
            onSelectLesson(nextLesson.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-sky-400 dark:hover:border-sky-600 text-right transition-all group shadow-2xs ml-auto w-full"
        >
          <div className="min-w-0 flex-1 text-right">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Next Lesson
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {nextLesson.title}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-50 dark:group-hover:bg-sky-950 group-hover:text-sky-600 transition-colors">
            <ChevronRight size={16} />
          </div>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
};
