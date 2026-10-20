// src/components/NotebookViewer.tsx
import React, { useState } from 'react';
import { NotebookCell, NotebookOutput } from '../types';
import { MarkdownRenderer, CodeBlockWithCopy } from '../utils/markdown-renderer';
import { ansiToHtml } from '../utils/ansi-parser';
import { Download, Copy, Check, Eye, EyeOff, Play, Terminal, Info, FileCode } from 'lucide-react';

interface NotebookViewerProps {
  cells: NotebookCell[];
  notebookTitle: string;
  notebookId: string;
  rawDownloadPath?: string;
}

export const NotebookViewer: React.FC<NotebookViewerProps> = ({
  cells,
  notebookTitle,
  notebookId,
  rawDownloadPath
}) => {
  const [hideOutputs, setHideOutputs] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [collapsedCells, setCollapsedCells] = useState<Record<string, boolean>>({});

  const toggleCellCollapse = (cellId: string) => {
    setCollapsedCells(prev => ({ ...prev, [cellId]: !prev[cellId] }));
  };

  const handleCopyAllCode = () => {
    const allCode = cells
      .filter(c => c.cell_type === 'code')
      .map(c => `# In [${c.execution_count ?? ' '}]:\n${c.source}`)
      .join('\n\n');
    navigator.clipboard.writeText(allCode);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const codeCellCount = cells.filter(c => c.cell_type === 'code').length;
  const mdCellCount = cells.filter(c => c.cell_type === 'markdown').length;

  return (
    <div className="jupyter-notebook-container max-w-5xl mx-auto">
      {/* Notebook Action Toolbar */}
      <div className="notebook-toolbar flex flex-wrap items-center justify-between gap-3 px-4 py-3 mb-6 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-slate-200">
            <FileCode size={14} className="text-sky-600 dark:text-sky-400" />
            Jupyter Notebook
          </span>
          <span>{cells.length} cells ({codeCellCount} code, {mdCellCount} markdown)</span>
          <span className="hidden sm:inline text-slate-400">• Python 3 Kernel</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle outputs */}
          <button
            onClick={() => setHideOutputs(!hideOutputs)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            title={hideOutputs ? 'Show outputs' : 'Hide outputs'}
          >
            {hideOutputs ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{hideOutputs ? 'Show Outputs' : 'Hide Outputs'}</span>
          </button>

          {/* Copy all code */}
          <button
            onClick={handleCopyAllCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            title="Copy all code cells to clipboard"
          >
            {copiedAll ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copiedAll ? 'Copied All Code' : 'Copy Code'}</span>
          </button>

          {/* Download Raw .ipynb */}
          <a
            href={`./raw-notebooks/${notebookId}.ipynb`}
            download={`${notebookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.ipynb`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors"
            title="Download original .ipynb file"
          >
            <Download size={14} />
            <span>Download .ipynb</span>
          </a>
        </div>
      </div>

      {/* Cells List */}
      <div className="notebook-cells-flow space-y-4">
        {cells.map((cell, idx) => (
          <NotebookCellItem
            key={cell.id || `cell-${idx}`}
            cell={cell}
            index={idx}
            hideOutputs={hideOutputs}
            isCollapsed={!!collapsedCells[cell.id]}
            onToggleCollapse={() => toggleCellCollapse(cell.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Notebook Cell Item
const NotebookCellItem: React.FC<{
  cell: NotebookCell;
  index: number;
  hideOutputs: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ cell, index, hideOutputs, isCollapsed, onToggleCollapse }) => {
  const isCode = cell.cell_type === 'code';
  const execPrompt = cell.execution_count != null ? `[${cell.execution_count}]` : '[ ]';

  if (!isCode) {
    // Markdown Cell
    return (
      <div className="notebook-cell markdown-cell group flex gap-3 px-3 py-2 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
        {/* Jupyter-like prompt gutter */}
        <div className="cell-prompt flex-shrink-0 w-16 text-right font-mono text-xs select-none text-slate-400 dark:text-slate-600 pt-1">
          {/* subtle index */}
        </div>
        <div className="cell-content flex-grow min-w-0">
          <MarkdownRenderer content={cell.source} attachments={cell.attachments} />
        </div>
      </div>
    );
  }

  // Code Cell
  return (
    <div className="notebook-cell code-cell group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-colors">
      {/* Input Section */}
      <div className="cell-input-block flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80">
        <div className="cell-prompt flex-shrink-0 font-mono text-xs font-semibold text-sky-700 dark:text-sky-400 select-none pt-0.5 sm:pt-1">
          In {execPrompt}:
        </div>
        <div className="cell-input-code w-full flex-grow min-w-0">
          <CodeBlockWithCopy code={cell.source} lang="python" />
        </div>
      </div>

      {/* Output Section */}
      {!hideOutputs && cell.outputs && cell.outputs.length > 0 && !isCollapsed && (
        <div className="cell-output-block p-2.5 sm:p-3 space-y-3 bg-white dark:bg-slate-950/70">
          {cell.outputs.map((output, oIdx) => (
            <NotebookOutputItem key={oIdx} output={output} />
          ))}
        </div>
      )}
    </div>
  );
};

// Notebook Output Item
const NotebookOutputItem: React.FC<{ output: NotebookOutput }> = ({ output }) => {
  const execPrompt = output.execution_count != null ? `[${output.execution_count}]` : '';

  // 1. Stream (stdout / stderr)
  if (output.output_type === 'stream') {
    const streamText = Array.isArray(output.text) ? output.text.join('') : (output.text || '');
    const isErrorStream = output.name === 'stderr';
    return (
      <div className="output-stream flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
        <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-slate-400 select-none pt-0.5">
          {output.name === 'stderr' ? 'stderr' : ''}
        </div>
        <pre
          className={`w-full flex-grow p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed ${
            isErrorStream
              ? 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
              : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          {streamText}
        </pre>
      </div>
    );
  }

  // 2. Error Traceback
  if (output.output_type === 'error') {
    const tracebackLines = output.traceback ? output.traceback.join('\n') : `${output.ename}: ${output.evalue}`;
    const formattedHtml = ansiToHtml(tracebackLines);
    return (
      <div className="output-error flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
        <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-rose-600 font-semibold select-none pt-0.5">
          Error:
        </div>
        <pre
          className="w-full flex-grow p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed bg-rose-50/70 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60"
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />
      </div>
    );
  }

  // 3. Execute Result & Display Data (rich mime types: html, images, plain text)
  if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
    const data = output.data || {};

    // HTML Output (e.g. Pandas DataFrame Table)
    if (data['text/html']) {
      const rawHtml = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
      // Strip potentially malicious scripts
      const sanitizedHtml = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      return (
        <div className="output-rich-html flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
          <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-rose-700 dark:text-rose-400 select-none pt-1">
            Out {execPrompt ? `[${execPrompt}]` : ''}:
          </div>
          <div
            className="w-full flex-grow overflow-x-auto p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 dataframe-container"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      );
    }

    // PNG Image Output (e.g. Matplotlib, Seaborn plot)
    if (data['image/png']) {
      const src = `data:image/png;base64,${data['image/png']}`;
      return (
        <div className="output-image flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
          <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-slate-400 select-none pt-1">
            Out:
          </div>
          <div className="max-w-full p-2 sm:p-3 bg-white dark:bg-white rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs inline-block">
            <img src={src} alt="Cell visualization output" className="max-w-full h-auto rounded" />
          </div>
        </div>
      );
    }

    // JPEG Image Output
    if (data['image/jpeg']) {
      const src = `data:image/jpeg;base64,${data['image/jpeg']}`;
      return (
        <div className="output-image flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
          <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-slate-400 select-none pt-1">
            Out:
          </div>
          <div className="max-w-full p-2 sm:p-3 bg-white dark:bg-white rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs inline-block">
            <img src={src} alt="Cell JPEG visualization" className="max-w-full h-auto rounded" />
          </div>
        </div>
      );
    }

    // SVG Output
    if (data['image/svg+xml']) {
      const svgText = Array.isArray(data['image/svg+xml']) ? data['image/svg+xml'].join('') : data['image/svg+xml'];
      return (
        <div className="output-svg flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
          <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-slate-400 select-none pt-1">
            Out:
          </div>
          <div
            className="w-full flex-grow p-3 bg-white rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svgText }}
          />
        </div>
      );
    }

    // Plain text output
    if (data['text/plain']) {
      const plainText = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
      return (
        <div className="output-plain flex flex-col sm:flex-row items-start gap-1 sm:gap-3">
          <div className="output-prompt flex-shrink-0 w-auto sm:w-16 text-left sm:text-right font-mono text-xs text-rose-700 dark:text-rose-400 select-none pt-0.5">
            Out {execPrompt ? `[${execPrompt}]` : ''}:
          </div>
          <pre className="w-full flex-grow p-2.5 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            {plainText}
          </pre>
        </div>
      );
    }
  }

  return null;
};
