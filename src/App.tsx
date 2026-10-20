// src/App.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import projectIndexData from './data/content-index.json';
import { ProjectIndex, LessonSummary } from './types';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { HomeDashboard } from './pages/HomeDashboard';
import { LessonPage } from './pages/LessonPage';
import { PracticeView } from './components/PracticeView';
import { getCompletedLessons, getBookmarks, getLastLessonId } from './utils/storage';

const projectIndex = projectIndexData as ProjectIndex;

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'lesson' | 'practice'>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(getCompletedLessons);
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<string[]>(getBookmarks);

  // Sync with progress changes
  const refreshStorageState = useCallback(() => {
    setCompletedLessonIds(getCompletedLessons());
    setBookmarkedLessonIds(getBookmarks());
  }, []);

  useEffect(() => {
    window.addEventListener('mlvault-progress-changed', refreshStorageState);
    window.addEventListener('mlvault-bookmarks-changed', refreshStorageState);
    return () => {
      window.removeEventListener('mlvault-progress-changed', refreshStorageState);
      window.removeEventListener('mlvault-bookmarks-changed', refreshStorageState);
    };
  }, [refreshStorageState]);

  // Handle URL hash changes for direct linking & back/forward browser buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('lesson/')) {
        const id = hash.replace('lesson/', '');
        const exists = projectIndex.allLessons.some((l) => l.id === id);
        if (exists) {
          setActiveLessonId(id);
          setActiveView('lesson');
        } else {
          setActiveView('dashboard');
        }
      } else if (hash === 'practice') {
        setActiveView('practice');
      } else {
        setActiveView('dashboard');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToLesson = (lessonId: string) => {
    window.location.hash = `#/lesson/${lessonId}`;
    setActiveLessonId(lessonId);
    setActiveView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '#/';
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPractice = () => {
    window.location.hash = '#/practice';
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active lesson object
  const activeLesson = useMemo(() => {
    return projectIndex.allLessons.find((l) => l.id === activeLessonId);
  }, [activeLessonId]);

  // Find subject for active lesson
  const activeSubject = useMemo(() => {
    if (!activeLesson) return undefined;
    return projectIndex.subjects.find((s) => s.id === activeLesson.subjectId);
  }, [activeLesson]);

  // Compute Prev and Next lessons for pagination
  const { prevLesson, nextLesson } = useMemo(() => {
    if (!activeLesson) return { prevLesson: undefined, nextLesson: undefined };
    const idx = projectIndex.allLessons.findIndex((l) => l.id === activeLesson.id);
    return {
      prevLesson: idx > 0 ? projectIndex.allLessons[idx - 1] : undefined,
      nextLesson: idx < projectIndex.allLessons.length - 1 ? projectIndex.allLessons[idx + 1] : undefined
    };
  }, [activeLesson]);

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased font-sans flex flex-col transition-colors">
      {/* Top Navigation */}
      <TopNav
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenPractice={navigateToPractice}
        totalLessons={projectIndex.allLessons.length}
        sidebarOpen={sidebarOpen}
        activeView={activeView}
        onNavigateHome={navigateToHome}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex min-w-0">
        {/* Left Collapsible Syllabus Sidebar */}
        <Sidebar
          subjects={projectIndex.subjects}
          currentLessonId={activeLessonId}
          onSelectLesson={navigateToLesson}
          onNavigateHome={navigateToHome}
          onOpenPractice={navigateToPractice}
          completedLessonIds={completedLessonIds}
          bookmarkedLessonIds={bookmarkedLessonIds}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Content View Area */}
        <div className="flex-1 min-w-0 pb-16">
          {activeView === 'dashboard' && (
            <HomeDashboard
              subjects={projectIndex.subjects}
              allLessons={projectIndex.allLessons}
              completedLessonIds={completedLessonIds}
              bookmarkedLessonIds={bookmarkedLessonIds}
              lastLessonId={getLastLessonId() || undefined}
              onSelectLesson={navigateToLesson}
              onOpenPractice={navigateToPractice}
            />
          )}

          {activeView === 'lesson' && activeLesson && (
            <LessonPage
              lessonSummary={activeLesson}
              subject={activeSubject}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              isCompleted={completedLessonIds.includes(activeLesson.id)}
              isBookmarked={bookmarkedLessonIds.includes(activeLesson.id)}
              onStatusChange={refreshStorageState}
              onSelectLesson={navigateToLesson}
              onNavigateHome={navigateToHome}
            />
          )}

          {activeView === 'practice' && (
            <PracticeView onNavigateToLesson={navigateToLesson} />
          )}
        </div>
      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        allLessons={projectIndex.allLessons}
        subjects={projectIndex.subjects}
        onSelectLesson={navigateToLesson}
      />
    </div>
  );
};
