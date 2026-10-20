// src/pages/LessonPage.tsx
import React, { useState, useEffect } from 'react';
import { LessonSummary, Subject, LessonDetail } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NotebookViewer } from '../components/NotebookViewer';
import { MarkdownRenderer } from '../utils/markdown-renderer';
import { PdfViewer } from '../components/PdfViewer';
import { TableOfContents } from '../components/TableOfContents';
import { Pagination } from '../components/Pagination';
import { setLastLessonId, toggleLessonCompleted, toggleBookmark } from '../utils/storage';
import {
  Loader2,
  AlertCircle,
  FileCode,
  BookOpen,
  FileText,
  Sparkles,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  Check,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LessonPageProps {
  lessonSummary: LessonSummary;
  subject?: Subject;
  prevLesson?: LessonSummary;
  nextLesson?: LessonSummary;
  isCompleted: boolean;
  isBookmarked: boolean;
  onStatusChange: () => void;
  onSelectLesson: (id: string) => void;
  onNavigateHome: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lessonSummary,
  subject,
  prevLesson,
  nextLesson,
  isCompleted,
  isBookmarked,
  onStatusChange,
  onSelectLesson,
  onNavigateHome
}) => {
  const [detail, setDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const headingsList = detail?.headings || lessonSummary.headings || [];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setMobileTocOpen(false);
    setLastLessonId(lessonSummary.id);

    // Fetch individual lesson payload from public/content-data/<lessonId>.json
    const dataUrl = `./content-data/${lessonSummary.id}.json`;

    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load content for ${lessonSummary.title} (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then((data: LessonDetail) => {
        if (isMounted) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError(err.message || 'Error loading lesson content');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lessonSummary.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        subject={subject}
        lesson={lessonSummary}
        onNavigateHome={onNavigateHome}
      />

      {/* Mobile-Only Action Bar & Collapsible Quick TOC (visible on mobile/tablet < 1024px) */}
      <div className="lg:hidden mb-6 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 space-y-3 shadow-2xs">
        {/* Top row: Read time, Difficulty, Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
              <Clock size={13} className="text-sky-500" />
              <span>{lessonSummary.estimatedMinutes || 10} min read</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
              {lessonSummary.difficulty || 'Intermediate'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mark Completed button */}
            <button
              onClick={() => {
                toggleLessonCompleted(lessonSummary.id);
                onStatusChange();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 size={13} className={isCompleted ? 'text-white' : 'text-emerald-500'} />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => {
                toggleBookmark(lessonSummary.id);
                onStatusChange();
              }}
              className={`flex items-center gap-1 p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={isBookmarked ? 'Saved in Starred' : 'Bookmark lesson'}
              aria-label="Bookmark lesson"
            >
              <Bookmark size={14} className={isBookmarked ? 'text-amber-500 fill-amber-500' : ''} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title="Share lesson URL"
              aria-label="Share lesson link"
            >
              {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            </button>
          </div>
        </div>

        {/* Collapsible "On this page" TOC dropdown if headings exist */}
        {headingsList.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              <span className="flex items-center gap-1.5">
                <List size={13} className="text-sky-500" />
                <span>On this page ({headingsList.length} sections)</span>
              </span>
              {mobileTocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {mobileTocOpen && (
              <div className="mt-2 pl-2 space-y-1.5 text-xs border-l-2 border-sky-500/40 max-h-52 overflow-y-auto">
                {headingsList.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      const el = document.getElementById(h.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setMobileTocOpen(false);
                      }
                    }}
                    className={`block w-full text-left py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                      h.level === 3 ? 'pl-3 text-[11px]' : ''
                    }`}
                  >
                    {h.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout (Content + Table of Contents) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
              <Loader2 className="animate-spin text-sky-500" size={32} />
              <p className="text-sm">Loading notebook workspace...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 text-center space-y-3">
              <AlertCircle size={36} className="mx-auto text-rose-500" />
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">
                Failed to Load Study Lesson
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                {error}
              </p>
            </div>
          ) : detail ? (
            <>
              {/* Notebook Format */}
              {detail.format === 'notebook' && detail.cells ? (
                <NotebookViewer
                  cells={detail.cells}
                  notebookTitle={detail.title}
                  notebookId={detail.id}
                  rawDownloadPath={detail.relativePath}
                />
              ) : null}

              {/* Markdown Format */}
              {detail.format === 'markdown' && detail.content ? (
                <div className="markdown-lesson-container max-w-4xl mx-auto p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <MarkdownRenderer content={detail.content} />
                </div>
              ) : null}

              {/* PDF Format */}
              {detail.format === 'pdf' ? (
                <PdfViewer
                  title={detail.title}
                  pdfUrl={detail.pdfUrl || detail.relativePath}
                  githubBlobUrl={detail.githubBlobUrl}
                  githubRawUrl={detail.githubRawUrl}
                  sizeMB={detail.sizeMB}
                  description={detail.description}
                  subjectTitle={subject?.title}
                />
              ) : null}
            </>
          ) : null}

          {/* Bottom Prev / Next Lesson Navigation */}
          <Pagination
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            onSelectLesson={onSelectLesson}
          />
        </main>

        {/* Right Sidebar Table of Contents (Desktop) */}
        <aside className="hidden lg:block sticky top-20 flex-shrink-0">
          <TableOfContents
            headings={detail?.headings || lessonSummary.headings}
            lessonId={lessonSummary.id}
            difficulty={lessonSummary.difficulty}
            estimatedMinutes={lessonSummary.estimatedMinutes}
            prerequisites={lessonSummary.prerequisites}
            isCompleted={isCompleted}
            isBookmarked={isBookmarked}
            onStatusChange={onStatusChange}
          />
        </aside>
      </div>
    </div>
  );
};
