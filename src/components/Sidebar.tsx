// src/components/Sidebar.tsx
import React, { useState, useMemo } from 'react';
import { Subject, LessonSummary } from '../types';
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  BookOpen,
  FileText,
  CheckCircle2,
  Bookmark,
  Filter,
  FolderGit2,
  Sparkles,
  LayoutDashboard,
  X
} from 'lucide-react';

interface SidebarProps {
  subjects: Subject[];
  currentLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  onNavigateHome: () => void;
  onOpenPractice: () => void;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  subjects,
  currentLessonId,
  onSelectLesson,
  onNavigateHome,
  onOpenPractice,
  completedLessonIds,
  bookmarkedLessonIds,
  isOpen,
  onCloseMobile
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'notebooks' | 'bookmarked'>('all');
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>(() => {
    // By default, open subjects with lessons or the one containing currentLessonId
    const initial: Record<string, boolean> = {};
    subjects.forEach((s) => {
      const hasCurrent = s.lessons.some((l) => l.id === currentLessonId);
      initial[s.id] = !hasCurrent && s.lessons.length === 0;
    });
    return initial;
  });

  const toggleSubject = (subjectId: string) => {
    setCollapsedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  // Filter subjects and lessons based on text & tab filter
  const filteredSubjects = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();

    return subjects
      .map((sub) => {
        const matchingLessons = sub.lessons.filter((lesson) => {
          // Tab filter
          if (activeTabFilter === 'notebooks' && lesson.format !== 'notebook') return false;
          if (activeTabFilter === 'bookmarked' && !bookmarkedLessonIds.includes(lesson.id)) return false;

          // Search query
          if (!q) return true;
          return (
            lesson.title.toLowerCase().includes(q) ||
            lesson.tags.some((t) => t.toLowerCase().includes(q)) ||
            sub.title.toLowerCase().includes(q)
          );
        });

        return {
          ...sub,
          lessons: matchingLessons
        };
      })
      .filter((sub) => sub.lessons.length > 0 || !searchFilter);
  }, [subjects, searchFilter, activeTabFilter, bookmarkedLessonIds]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-72 sm:w-80 flex flex-col bg-slate-50/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header: Title & Touch Dismiss */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-0 lg:hidden">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Curriculum Syllabus</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sidebar Header: Navigation Links */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onNavigateHome();
                onCloseMobile();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              <LayoutDashboard size={13} className="text-sky-500" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                onOpenPractice();
                onCloseMobile();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Q&A / Revision</span>
            </button>
          </div>

          {/* Quick Filter Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter syllabus..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Tab Filter Chips */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-0.5">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTabFilter === 'all'
                  ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-semibold'
                  : 'hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              All ({subjects.reduce((acc, s) => acc + s.lessons.length, 0)})
            </button>
            <button
              onClick={() => setActiveTabFilter('notebooks')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTabFilter === 'notebooks'
                  ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-semibold'
                  : 'hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              Notebooks
            </button>
            <button
              onClick={() => setActiveTabFilter('bookmarked')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTabFilter === 'bookmarked'
                  ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-semibold'
                  : 'hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              Starred ({bookmarkedLessonIds.length})
            </button>
          </div>
        </div>

        {/* Course Tree Syllabus */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {filteredSubjects.map((sub) => {
            const isCollapsed = !!collapsedSubjects[sub.id];
            const completedInSub = sub.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const subProgress = sub.lessons.length > 0 ? Math.round((completedInSub / sub.lessons.length) * 100) : 0;

            return (
              <div key={sub.id} className="subject-group rounded-lg overflow-hidden">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(sub.id)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-900 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      {sub.id.split('-')[0]}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs">
                      {sub.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-slate-400 font-mono">
                    {sub.lessons.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {sub.lessons.length}
                      </span>
                    )}
                  </div>
                </button>

                {/* Sub-lessons list */}
                {!isCollapsed && sub.lessons.length > 0 && (
                  <div className="pl-5 pr-1 py-0.5 space-y-0.5 border-l border-slate-200 dark:border-slate-800/80 ml-4 my-1">
                    {sub.lessons.map((lesson) => {
                      const isActive = currentLessonId === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isBookmarked = bookmarkedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            onSelectLesson(lesson.id);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-left transition-all group ${
                            isActive
                              ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-semibold border-l-2 border-sky-600'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Format Icon */}
                            {lesson.format === 'notebook' ? (
                              <FileCode
                                size={13}
                                className={isActive ? 'text-sky-600 dark:text-sky-400' : 'text-amber-500'}
                              />
                            ) : lesson.format === 'pdf' ? (
                              <FileText
                                size={13}
                                className={isActive ? 'text-sky-600 dark:text-sky-400' : 'text-rose-500'}
                              />
                            ) : (
                              <BookOpen
                                size={13}
                                className={isActive ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-500'}
                              />
                            )}

                            <span className="truncate text-xs">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isBookmarked && (
                              <Bookmark size={11} className="text-amber-400 fill-amber-400" />
                            )}
                            {isCompleted && (
                              <CheckCircle2 size={12} className="text-emerald-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
