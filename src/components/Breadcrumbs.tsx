// src/components/Breadcrumbs.tsx
import React from 'react';
import { ChevronRight, Home, BookOpen, FileCode, FileText } from 'lucide-react';
import { Subject, LessonSummary } from '../types';

interface BreadcrumbsProps {
  subject?: Subject;
  lesson?: LessonSummary;
  onNavigateHome: () => void;
  onSelectSubject?: (subjectId: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  subject,
  lesson,
  onNavigateHome,
}) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <Home size={13} />
        <span>MLVault</span>
      </button>

      {subject && (
        <>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="hover:text-slate-800 dark:hover:text-slate-200">
            {subject.title}
          </span>
        </>
      )}

      {lesson && (
        <>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
            {lesson.format === 'notebook' && <FileCode size={13} className="text-sky-600 dark:text-sky-400" />}
            {lesson.format === 'pdf' && <FileText size={13} className="text-rose-500" />}
            {lesson.format === 'markdown' && <BookOpen size={13} className="text-emerald-500" />}
            <span className="truncate">{lesson.title}</span>
          </span>
        </>
      )}
    </nav>
  );
};
