// src/components/PdfViewer.tsx
import React, { useState } from 'react';
import { Download, ExternalLink, FileText, AlertCircle, Eye } from 'lucide-react';

interface PdfViewerProps {
  title: string;
  pdfUrl: string;
  githubBlobUrl?: string;
  githubRawUrl?: string;
  sizeMB?: number;
  description?: string;
  subjectTitle?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  title,
  pdfUrl,
  githubBlobUrl,
  githubRawUrl,
  sizeMB,
  description,
  subjectTitle
}) => {
  const [loadError, setLoadError] = useState(false);

  // Fallback URLs
  const viewUrl = githubBlobUrl || pdfUrl;
  const downloadUrl = githubRawUrl || pdfUrl;

  return (
    <div className="pdf-viewer-wrapper max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
              <FileText size={12} />
              PDF Study Material
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description || 'Original curated study document and lecture notes.'}
            </p>
            {sizeMB && (
              <p className="text-xs font-mono text-slate-500">
                File size: {sizeMB.toFixed(2)} MB • Subject: {subjectTitle || 'Machine Learning'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xs transition-colors"
            >
              <ExternalLink size={15} />
              <span>View Document</span>
            </a>

            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer or Fallback */}
      <div className="pdf-frame-container rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-sm min-h-[680px]">
        {!loadError ? (
          <iframe
            src={downloadUrl}
            title={title}
            className="w-full h-[750px] border-none"
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[500px] space-y-4">
            <AlertCircle size={40} className="text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Browser PDF Preview Unavailable
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Your browser may not support inline PDF viewing or the file may be large. You can open or download the document directly:
            </p>
            <div className="flex items-center gap-3">
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye size={16} /> Open Document
              </a>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download size={16} /> Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
