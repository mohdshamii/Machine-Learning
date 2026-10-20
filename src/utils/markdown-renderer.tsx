// src/utils/markdown-renderer.tsx
import React, { useState } from 'react';
import katex from 'katex';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import { Copy, Check, Info, AlertTriangle, AlertCircle, Lightbulb, ShieldAlert } from 'lucide-react';

interface MarkdownProps {
  content: string;
  attachments?: Record<string, Record<string, string>>;
}

export const MarkdownRenderer: React.FC<MarkdownProps> = ({ content, attachments = {} }) => {
  if (!content) return null;

  // Pre-process attachments: replace ![alt](attachment:filename) with base64 data URI
  let processed = content;
  if (attachments) {
    for (const [filename, mimeObj] of Object.entries(attachments)) {
      const mime = Object.keys(mimeObj)[0];
      const base64Data = mimeObj[mime];
      const dataUri = `data:${mime};base64,${base64Data}`;
      processed = processed.split(`attachment:${filename}`).join(dataUri);
    }
  }

  // Split content by code blocks to avoid formatting math or markdown inside code
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(processed)) !== null) {
    // Process markdown before this code block
    if (match.index > lastIndex) {
      const mdChunk = processed.substring(lastIndex, match.index);
      parts.push(<RenderMarkdownChunk key={`md-${lastIndex}`} chunk={mdChunk} />);
    }

    const lang = match[1] || 'python';
    const code = match[2];
    parts.push(<CodeBlockWithCopy key={`code-${match.index}`} code={code} lang={lang} />);

    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < processed.length) {
    parts.push(<RenderMarkdownChunk key={`md-last`} chunk={processed.substring(lastIndex)} />);
  }

  return <div className="notebook-markdown-body">{parts}</div>;
};

// Component for Code Block with Syntax Highlighting and Copy Button
export const CodeBlockWithCopy: React.FC<{ code: string; lang?: string }> = ({ code, lang = 'python' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedHtml = React.useMemo(() => {
    try {
      const grammar = Prism.languages[lang] || Prism.languages.python;
      return Prism.highlight(code, grammar, lang);
    } catch {
      return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }, [code, lang]);

  return (
    <div className="code-block-wrapper my-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
      <div className="code-block-header flex items-center justify-between px-4 py-1.5 bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <span className="uppercase tracking-wider font-semibold text-slate-300">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-100 bg-slate-900">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
};

// Chunk renderer: handles math, tables, headers, callouts, lists, paragraphs
const RenderMarkdownChunk: React.FC<{ chunk: string }> = ({ chunk }) => {
  const renderedElements = React.useMemo(() => {
    const lines = chunk.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Alert Callouts (> [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION], > [!IMPORTANT])
      const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (alertMatch) {
        const type = alertMatch[1].toUpperCase();
        let calloutContent = '';
        i++;
        while (i < lines.length && lines[i].startsWith('>')) {
          calloutContent += lines[i].replace(/^>\s?/, '') + '\n';
          i++;
        }
        elements.push(
          <CalloutBox key={`callout-${i}`} type={type} content={calloutContent.trim()} />
        );
        continue;
      }

      // 2. Block Math: $$ ... $$
      if (line.trim().startsWith('$$')) {
        let mathText = line.trim().substring(2);
        if (mathText.endsWith('$$') && mathText.length > 2) {
          mathText = mathText.slice(0, -2);
          elements.push(<KaTeXBlock key={`math-${i}`} math={mathText} />);
          i++;
          continue;
        } else {
          i++;
          while (i < lines.length && !lines[i].trim().endsWith('$$')) {
            mathText += '\n' + lines[i];
            i++;
          }
          if (i < lines.length) {
            mathText += '\n' + lines[i].replace(/\$\$$/, '');
            i++;
          }
          elements.push(<KaTeXBlock key={`math-${i}`} math={mathText} />);
          continue;
        }
      }

      // 3. Headings (#, ##, ###, ####)
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const rawTitle = headingMatch[2];
        const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        elements.push(
          <HeadingTag
            key={`h-${i}`}
            id={slug}
            className={`font-bold tracking-tight scroll-mt-20 ${
              level === 1
                ? 'text-2xl lg:text-3xl mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                : level === 2
                ? 'text-xl lg:text-2xl mt-6 mb-3 text-slate-800 dark:text-slate-200'
                : level === 3
                ? 'text-lg lg:text-xl mt-5 mb-2 text-slate-800 dark:text-slate-300'
                : 'text-base font-semibold mt-4 mb-2 text-slate-700 dark:text-slate-300'
            }`}
          >
            <InlineMathAndFormatting text={rawTitle} />
          </HeadingTag>
        );
        i++;
        continue;
      }

      // 4. Markdown Tables (| Col1 | Col2 | ...)
      if (line.trim().startsWith('|') && line.includes('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        elements.push(<MarkdownTable key={`table-${i}`} tableLines={tableLines} />);
        continue;
      }

      // 5. Blockquote (> regular quote)
      if (line.startsWith('>')) {
        let quoteText = line.replace(/^>\s?/, '');
        i++;
        while (i < lines.length && lines[i].startsWith('>')) {
          quoteText += ' ' + lines[i].replace(/^>\s?/, '');
          i++;
        }
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 pl-4 border-l-4 border-sky-500/80 bg-sky-50/50 dark:bg-sky-950/20 py-2 pr-3 text-slate-700 dark:text-slate-300 italic text-sm rounded-r"
          >
            <InlineMathAndFormatting text={quoteText} />
          </blockquote>
        );
        continue;
      }

      // 6. Horizontal Rules (--- or ***)
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        elements.push(
          <hr key={`hr-${i}`} className="my-6 border-slate-200 dark:border-slate-800" />
        );
        i++;
        continue;
      }

      // 7. Unordered / Ordered Lists (- item or 1. item)
      if (/^(\s*[-*+]|\s*\d+\.)\s+/.test(line)) {
        const listItems: string[] = [];
        const isOrdered = /^\s*\d+\./.test(line);
        while (i < lines.length && /^(\s*[-*+]|\s*\d+\.)\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^(\s*[-*+]|\s*\d+\.)\s+/, ''));
          i++;
        }
        elements.push(
          isOrdered ? (
            <ol key={`list-${i}`} className="my-3 ml-6 list-decimal space-y-1 text-slate-700 dark:text-slate-300">
              {listItems.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  <InlineMathAndFormatting text={item} />
                </li>
              ))}
            </ol>
          ) : (
            <ul key={`list-${i}`} className="my-3 ml-6 list-disc space-y-1 text-slate-700 dark:text-slate-300">
              {listItems.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  <InlineMathAndFormatting text={item} />
                </li>
              ))}
            </ul>
          )
        );
        continue;
      }

      // 8. Collapsible <details><summary>...
      if (line.includes('<details>')) {
        let detailsBlock = line;
        i++;
        while (i < lines.length && !lines[i].includes('</details>')) {
          detailsBlock += '\n' + lines[i];
          i++;
        }
        if (i < lines.length) {
          detailsBlock += '\n' + lines[i];
          i++;
        }
        elements.push(<DetailsAccordion key={`details-${i}`} rawHtml={detailsBlock} />);
        continue;
      }

      // 9. Standard Paragraph
      if (line.trim().length > 0) {
        let para = line;
        i++;
        while (i < lines.length && lines[i].trim().length > 0 && !lines[i].startsWith('#') && !lines[i].startsWith('|') && !lines[i].startsWith('>') && !lines[i].startsWith('$$')) {
          para += ' ' + lines[i].trim();
          i++;
        }
        elements.push(
          <p key={`p-${i}`} className="my-3 leading-relaxed text-slate-700 dark:text-slate-300 text-sm lg:text-base">
            <InlineMathAndFormatting text={para} />
          </p>
        );
        continue;
      }

      i++;
    }

    return elements;
  }, [chunk]);

  return <>{renderedElements}</>;
};

// KaTeX Block Equation Renderer
const KaTeXBlock: React.FC<{ math: string }> = ({ math }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className="katex-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Inline Math & Formatting (Bold, Italic, Links, Images, Code)
const InlineMathAndFormatting: React.FC<{ text: string }> = ({ text }) => {
  // Replace inline math $...$ first
  const mathSplits = text.split(/(\$[^\$]+?\$)/g);

  return (
    <>
      {mathSplits.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const formula = part.slice(1, -1);
          try {
            const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
            return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <code key={idx} className="font-mono text-sm px-1 rounded bg-slate-100 dark:bg-slate-800">{formula}</code>;
          }
        }
        return <span key={idx} dangerouslySetInnerHTML={{ __html: parseBasicInlineMarkdown(part) }} />;
      })}
    </>
  );
};

function parseBasicInlineMarkdown(text: string): string {
  return text
    // Images: ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-3 max-w-full rounded border border-slate-200 dark:border-slate-800 shadow-sm inline-block" />')
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 underline underline-offset-2 hover:text-sky-700 dark:hover:text-sky-300 font-medium">$1</a>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60">$1</code>')
    // Bold: **text**
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>')
    // Italic: *text*
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
}

// GitHub Style Alert Callouts
const CalloutBox: React.FC<{ type: string; content: string }> = ({ type, content }) => {
  const meta = {
    NOTE: { icon: Info, border: 'border-blue-500', bg: 'bg-blue-50/70 dark:bg-blue-950/20', text: 'text-blue-900 dark:text-blue-300', title: 'Note' },
    TIP: { icon: Lightbulb, border: 'border-emerald-500', bg: 'bg-emerald-50/70 dark:bg-emerald-950/20', text: 'text-emerald-900 dark:text-emerald-300', title: 'Tip' },
    IMPORTANT: { icon: AlertCircle, border: 'border-purple-500', bg: 'bg-purple-50/70 dark:bg-purple-950/20', text: 'text-purple-900 dark:text-purple-300', title: 'Important' },
    WARNING: { icon: AlertTriangle, border: 'border-amber-500', bg: 'bg-amber-50/70 dark:bg-amber-950/20', text: 'text-amber-900 dark:text-amber-300', title: 'Warning' },
    CAUTION: { icon: ShieldAlert, border: 'border-rose-500', bg: 'bg-rose-50/70 dark:bg-rose-950/20', text: 'text-rose-900 dark:text-rose-300', title: 'Caution' }
  }[type] || { icon: Info, border: 'border-slate-500', bg: 'bg-slate-50 dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-200', title: type };

  const IconComp = meta.icon;

  return (
    <div className={`my-4 p-4 rounded-lg border-l-4 ${meta.border} ${meta.bg} shadow-xs`}>
      <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm">
        <IconComp size={16} className={meta.text} />
        <span className={meta.text}>{meta.title}</span>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <InlineMathAndFormatting text={content} />
      </div>
    </div>
  );
};

// Markdown Table Renderer
const MarkdownTable: React.FC<{ tableLines: string[] }> = ({ tableLines }) => {
  if (tableLines.length < 2) return null;

  const headerCells = tableLines[0].split('|').map(c => c.trim()).filter(Boolean);
  const bodyRows = tableLines.slice(2).map(line =>
    line.split('|').map(c => c.trim()).filter(Boolean)
  );

  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
          <tr>
            {headerCells.map((h, idx) => (
              <th key={idx} className="px-4 py-2.5">
                <InlineMathAndFormatting text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950/40">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5">
                  <InlineMathAndFormatting text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Collapsible Details Accordion
const DetailsAccordion: React.FC<{ rawHtml: string }> = ({ rawHtml }) => {
  const summaryMatch = rawHtml.match(/<summary>([\s\S]*?)<\/summary>/);
  const summaryText = summaryMatch ? summaryMatch[1].trim() : 'Click to reveal';
  const bodyContent = rawHtml
    .replace(/<details>/g, '')
    .replace(/<\/details>/g, '')
    .replace(/<summary>[\s\S]*?<\/summary>/g, '')
    .trim();

  return (
    <details className="my-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3 group">
      <summary className="font-medium text-sm text-sky-700 dark:text-sky-400 cursor-pointer select-none hover:text-sky-800 dark:hover:text-sky-300 flex items-center justify-between">
        <span>{summaryText}</span>
        <span className="text-xs text-slate-400 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <InlineMathAndFormatting text={bodyContent} />
      </div>
    </details>
  );
};
