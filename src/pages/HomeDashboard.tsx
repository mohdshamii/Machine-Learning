// src/pages/HomeDashboard.tsx
import React from 'react';
import { Subject, LessonSummary } from '../types';
import {
  FileCode,
  BookOpen,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';

interface HomeDashboardProps {
  subjects: Subject[];
  allLessons: LessonSummary[];
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  lastLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  onOpenPractice: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  subjects,
  allLessons,
  completedLessonIds,
  bookmarkedLessonIds,
  lastLessonId,
  onSelectLesson,
  onOpenPractice
}) => {
  const completedCount = completedLessonIds.length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const lastLesson = allLessons.find((l) => l.id === lastLessonId) || allLessons[0];
  const notebookCount = allLessons.filter((l) => l.format === 'notebook').length;
  const pdfCount = allLessons.filter((l) => l.format === 'pdf').length;
  const markdownCount = allLessons.filter((l) => l.format === 'markdown').length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Hero Banner */}
      <div className="hero-banner-card">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <GraduationCap size={14} />
            <span>Curated by Mohd Shami • Interactive Study Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            MLVault Learning Hub
          </h1>

          <p className="text-sm sm:text-base leading-relaxed">
            From linear algebra and calculus to state-of-the-art transformers and MLOps. Explore hands-on Jupyter notebooks, derivations from scratch, handwritten lecture notes, and formula revision sheets.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {lastLesson && (
              <button
                onClick={() => onSelectLesson(lastLesson.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>Continue: {lastLesson.title}</span>
                <ArrowRight size={15} />
              </button>
            )}

            <button
              onClick={onOpenPractice}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all"
            >
              <Sparkles size={15} className="text-amber-400" />
              <span>Practice & Flashcards</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full border-l border-white/20 grid grid-cols-4 grid-rows-4" />
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="text-slate-400 text-xs font-medium">Curriculum Subjects</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">21</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Foundations to MLOps</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="text-slate-400 text-xs font-medium">Jupyter Notebooks</div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{notebookCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hands-on practical labs</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="text-slate-400 text-xs font-medium">Reference PDFs & Notes</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{pdfCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Handwritten & cheat sheets</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="text-slate-400 text-xs font-medium">Your Progress</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{progressPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{completedCount} of {totalCount} completed</div>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-sky-500" />
            <span>Complete 21-Subject Curriculum</span>
          </h2>
          <span className="text-xs text-slate-500">{totalCount} total study items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const completedInSub = sub.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const subProgress = sub.lessons.length > 0 ? Math.round((completedInSub / sub.lessons.length) * 100) : 0;

            return (
              <div
                key={sub.id}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      Module {sub.id.split('-')[0]}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {sub.lessons.length} {sub.lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {sub.title}
                  </h3>

                  {/* Lessons list preview */}
                  <div className="space-y-1.5 pt-1">
                    {sub.lessons.slice(0, 3).map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className="w-full text-left text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 py-0.5 truncate transition-colors"
                      >
                        {lesson.format === 'notebook' ? (
                          <FileCode size={12} className="text-amber-500 flex-shrink-0" />
                        ) : lesson.format === 'pdf' ? (
                          <FileText size={12} className="text-rose-500 flex-shrink-0" />
                        ) : (
                          <BookOpen size={12} className="text-emerald-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    ))}
                    {sub.lessons.length > 3 && (
                      <span className="text-[11px] text-slate-400 font-mono block pl-4">
                        +{sub.lessons.length - 3} more items
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>Progress</span>
                    <span>{subProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-300"
                      style={{ width: `${subProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
