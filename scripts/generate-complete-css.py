# scripts/generate-complete-css.py
"""
Generates the comprehensive, production-grade CSS for MLVault.
Includes full support for:
- Desktop, Tablet, and Mobile (<640px)
- Safari/WebKit (touch scrolling, backdrop blur, safe area insets)
- Firefox and Chromium scrollbars & layout
- Pure CSS dark mode with instant switching
- Exact escaped classes for all Tailwind utilities used in React components
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS_FILE = ROOT / "src" / "styles" / "index.css"

def generate_css():
    css = """/* src/styles/index.css - MLVault Universal Cross-Browser Design System */
@import 'katex/dist/katex.min.css';

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', monospace;

  /* Classic Jupyter / ML Study Light Palette */
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-muted: #f1f5f9;
  --bg-subtle: #f8fafc;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-subtle: #94a3b8;
  --border-color: #e2e8f0;
  --border-subtle: #f1f5f9;

  --jupyter-blue: #0284c7;
  --jupyter-blue-hover: #0369a1;
  --jupyter-blue-subtle: #e0f2fe;

  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

html.dark {
  /* Jupyter Lab Dark Palette */
  --bg-app: #090d16;
  --bg-surface: #0f172a;
  --bg-muted: #1e293b;
  --bg-subtle: #131d31;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
  --border-color: #1e293b;
  --border-subtle: #172338;

  --jupyter-blue: #38bdf8;
  --jupyter-blue-hover: #7dd3fc;
  --jupyter-blue-subtle: #082f49;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
  height: 100%;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  touch-action: manipulation;
}

/* Scrollbars */
* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
html.dark * {
  scrollbar-color: #334155 transparent;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
html.dark ::-webkit-scrollbar-thumb { background: #334155; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

pre, code, table, .katex-display, .katex-block, .dataframe-container {
  -webkit-overflow-scrolling: touch;
}

img, video, iframe, canvas, svg {
  max-width: 100%;
  height: auto;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

input {
  font-family: inherit;
  -webkit-appearance: none;
  appearance: none;
}

/* ==========================================================================
   DISPLAY & POSITIONING
   ========================================================================== */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }

.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-1 { flex: 1 1 0%; }
.flex-grow { flex-grow: 1; }
.flex-shrink-0 { flex-shrink: 0; }

.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }

.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-0 { top: 0; }
.top-14 { top: 3.5rem; }
.top-20 { top: 5rem; }
.left-0 { left: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }

.z-10 { z-index: 10; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }

.pointer-events-none { pointer-events: none; }
.select-none { -webkit-user-select: none; user-select: none; }
.cursor-pointer { cursor: pointer; }
.opacity-10 { opacity: 0.1; }

/* Grid columns & rows */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-rows-4 { grid-template-rows: repeat(4, minmax(0, 1fr)); }

/* ==========================================================================
   TRANSFORMS & TRANSITIONS (CRITICAL FOR MOBILE DRAWER & ANIMATIONS)
   ========================================================================== */
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

.translate-x-0 { transform: translateX(0px); }
.-translate-x-full { transform: translateX(-100%); }

/* Backdrop Blur */
.backdrop-blur-xs { -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); }
.backdrop-blur-md { -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }

/* ==========================================================================
   SPACING (PADDINGS, MARGINS, GAPS, SPACE-Y)
   ========================================================================== */
.gap-0\\.5 { gap: 0.125rem; }
.gap-1 { gap: 0.25rem; }
.gap-1\\.5 { gap: 0.375rem; }
.gap-2 { gap: 0.5rem; }
.gap-2\\.5 { gap: 0.625rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

.p-1 { padding: 0.25rem; }
.p-1\\.5 { padding: 0.375rem; }
.p-2 { padding: 0.5rem; }
.p-2\\.5 { padding: 0.625rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-5 { padding: 1.25rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.p-12 { padding: 3rem; }

.px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-3\\.5 { padding-left: 0.875rem; padding-right: 0.875rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }

.py-0\\.2 { padding-top: 0.05rem; padding-bottom: 0.05rem; }
.py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }

.pb-0 { padding-bottom: 0px; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pb-16 { padding-bottom: 4rem; }
.pt-0\\.5 { padding-top: 0.125rem; }
.pt-1 { padding-top: 0.25rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-2\\.5 { padding-top: 0.625rem; }
.pt-4 { padding-top: 1rem; }
.pt-8 { padding-top: 2rem; }
.pt-16 { padding-top: 4rem; }
.pl-2 { padding-left: 0.5rem; }
.pl-3 { padding-left: 0.75rem; }
.pl-4 { padding-left: 1rem; }
.pl-5 { padding-left: 1.25rem; }
.pr-1 { padding-right: 0.25rem; }
.pr-3 { padding-right: 0.75rem; }

.mx-auto { margin-left: auto; margin-right: auto; }
.mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
.mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
.my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
.my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
.my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-1\\.5 { margin-bottom: 0.375rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-0\\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-2\\.5 { margin-top: 0.625rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.25rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mt-12 { margin-top: 3rem; }
.ml-4 { margin-left: 1rem; }
.ml-6 { margin-left: 1.5rem; }
.ml-auto { margin-left: auto; }
.-mx-4 { margin-left: -1rem; margin-right: -1rem; }
.-mt-0\\.5 { margin-top: -0.125rem; }

/* Stack spacing */
.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.125rem; }
.space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.375rem; }
.space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
.space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
.space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.25rem; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
.space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
.space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.5rem; }

/* Dividers */
.divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; border-top-style: solid; }
.divide-slate-100 > :not([hidden]) ~ :not([hidden]) { border-color: #f1f5f9; }
.divide-slate-200 > :not([hidden]) ~ :not([hidden]) { border-color: #e2e8f0; }
html.dark .dark\\:divide-slate-800 > :not([hidden]) ~ :not([hidden]) { border-color: #1e293b; }
html.dark .dark\\:divide-slate-800\\/60 > :not([hidden]) ~ :not([hidden]) { border-color: rgba(30, 41, 59, 0.6); }

/* ==========================================================================
   DIMENSIONS & OVERFLOW
   ========================================================================== */
.w-full { width: 100%; }
.w-auto { width: auto; }
.w-8 { width: 2rem; }
.w-16 { width: 4rem; }
.w-64 { width: 16rem; }
.w-72 { width: 18rem; }
.w-80 { width: 20rem; }
.w-1\\/3 { width: 33.333333%; }

.h-1\\.5 { height: 0.375rem; }
.h-8 { height: 2rem; }
.h-14 { height: 3.5rem; }
.h-full { height: 100%; }
.h-auto { height: auto; }
.h-\\[500px\\] { height: 500px; }
.h-\\[750px\\] { height: 750px; }
.h-\\[calc\\(100vh-3\\.5rem\\)\\] { height: calc(100vh - 3.5rem); }

.min-w-0 { min-width: 0px; }
.min-h-screen { min-height: 100vh; }
.min-h-\\[320px\\] { min-height: 320px; }
.min-h-\\[400px\\] { min-height: 400px; }
.min-h-\\[680px\\] { min-height: 680px; }

.max-w-md { max-width: 28rem; }
.max-w-xl { max-width: 36rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-4xl { max-width: 56rem; }
.max-w-5xl { max-width: 64rem; }
.max-w-7xl { max-width: 80rem; }
.max-w-full { max-width: 100%; }
.max-h-52 { max-height: 13rem; }
.max-h-\\[80vh\\] { max-height: 80vh; }

.overflow-hidden { overflow: hidden; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

/* ==========================================================================
   ROUNDING & BORDERS
   ========================================================================== */
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }
.rounded-r { border-top-right-radius: 0.25rem; border-bottom-right-radius: 0.25rem; }

.border { border-width: 1px; border-style: solid; }
.border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.border-t { border-top-width: 1px; border-top-style: solid; }
.border-l { border-left-width: 1px; border-left-style: solid; }
.border-r { border-right-width: 1px; border-right-style: solid; }
.border-l-2 { border-left-width: 2px; border-left-style: solid; }
.border-l-4 { border-left-width: 4px; border-left-style: solid; }
.border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
.border-none { border-style: none; }
.border-transparent { border-color: transparent; }
.border-collapse { border-collapse: collapse; }

.border-slate-100 { border-color: #f1f5f9; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
.border-slate-700 { border-color: #334155; }
.border-slate-700\\/50 { border-color: rgba(51, 65, 85, 0.5); }
.border-slate-800 { border-color: #1e293b; }
.border-sky-200 { border-color: #bae6fd; }
.border-sky-300 { border-color: #7dd3fc; }
.border-sky-400\\/30 { border-color: rgba(56, 189, 248, 0.3); }
.border-sky-500 { border-color: #0ea5e9; }
.border-sky-500\\/40 { border-color: rgba(14, 165, 233, 0.4); }
.border-sky-500\\/80 { border-color: rgba(14, 165, 233, 0.8); }
.border-sky-600 { border-color: #0284c7; }
.border-emerald-200 { border-color: #a7f3d0; }
.border-emerald-500 { border-color: #10b981; }
.border-rose-200 { border-color: #fecdd3; }
.border-rose-500 { border-color: #f43f5e; }
.border-amber-200 { border-color: #fde68a; }
.border-amber-300 { border-color: #fcd34d; }
.border-white\\/20 { border-color: rgba(255, 255, 255, 0.2); }

html.dark .dark\\:border-slate-700 { border-color: #334155; }
html.dark .dark\\:border-slate-800 { border-color: #1e293b; }
html.dark .dark\\:border-slate-800\\/80 { border-color: rgba(30, 41, 59, 0.8); }
html.dark .dark\\:border-amber-800 { border-color: #92400e; }
html.dark .dark\\:border-amber-900\\/60 { border-color: rgba(120, 53, 15, 0.6); }
html.dark .dark\\:border-rose-900\\/50 { border-color: rgba(136, 19, 55, 0.5); }
html.dark .dark\\:border-rose-900\\/60 { border-color: rgba(136, 19, 55, 0.6); }
html.dark .dark\\:border-emerald-900\\/60 { border-color: rgba(6, 78, 59, 0.6); }

/* ==========================================================================
   BACKGROUND COLORS (LIGHT & DARK WITH EXACT OPACITY COVERAGE)
   ========================================================================== */
.bg-white { background-color: #ffffff; }
.bg-white\\/95 { background-color: rgba(255, 255, 255, 0.95); }
.bg-transparent { background-color: transparent; }

.bg-slate-50 { background-color: #f8fafc; }
.bg-slate-50\\/50 { background-color: rgba(248, 250, 252, 0.5); }
.bg-slate-50\\/60 { background-color: rgba(248, 250, 252, 0.6); }
.bg-slate-50\\/70 { background-color: rgba(248, 250, 252, 0.7); }
.bg-slate-50\\/80 { background-color: rgba(248, 250, 252, 0.8); }
.bg-slate-50\\/95 { background-color: rgba(248, 250, 252, 0.95); }

.bg-slate-100 { background-color: #f1f5f9; }
.bg-slate-100\\/60 { background-color: rgba(241, 245, 249, 0.6); }
.bg-slate-100\\/80 { background-color: rgba(241, 245, 249, 0.8); }

.bg-slate-200 { background-color: #e2e8f0; }
.bg-slate-200\\/60 { background-color: rgba(226, 232, 240, 0.6); }

.bg-slate-800 { background-color: #1e293b; }
.bg-slate-800\\/80 { background-color: rgba(30, 41, 59, 0.8); }
.bg-slate-900 { background-color: #0f172a; }
.bg-slate-900\\/50 { background-color: rgba(15, 23, 42, 0.5); }
.bg-slate-900\\/60 { background-color: rgba(15, 23, 42, 0.6); }
.bg-slate-950 { background-color: #020617; }
.bg-slate-950\\/60 { background-color: rgba(2, 6, 23, 0.6); }
.bg-slate-950\\/70 { background-color: rgba(2, 6, 23, 0.7); }
.bg-slate-950\\/95 { background-color: rgba(2, 6, 23, 0.95); }

.bg-sky-50 { background-color: #f0f9ff; }
.bg-sky-50\\/50 { background-color: rgba(240, 249, 255, 0.5); }
.bg-sky-100 { background-color: #e0f2fe; }
.bg-sky-500 { background-color: #0ea5e9; }
.bg-sky-500\\/20 { background-color: rgba(14, 165, 233, 0.2); }
.bg-sky-600 { background-color: #0284c7; }

.bg-emerald-50 { background-color: #ecfdf5; }
.bg-emerald-50\\/70 { background-color: rgba(236, 253, 245, 0.7); }
.bg-emerald-600 { background-color: #059669; }

.bg-rose-50 { background-color: #fff1f2; }
.bg-rose-50\\/70 { background-color: rgba(255, 241, 242, 0.7); }
.bg-rose-50\\/80 { background-color: rgba(255, 241, 242, 0.8); }
.bg-rose-100 { background-color: #ffe4e6; }

.bg-amber-50 { background-color: #fffbeb; }
.bg-amber-50\\/70 { background-color: rgba(255, 251, 235, 0.7); }
.bg-amber-100 { background-color: #fef3c7; }

/* Dark Mode Backgrounds */
html.dark .dark\\:bg-white { background-color: #ffffff; }
html.dark .dark\\:bg-slate-800 { background-color: #1e293b; }
html.dark .dark\\:bg-slate-900 { background-color: #0f172a; }
html.dark .dark\\:bg-slate-900\\/40 { background-color: rgba(15, 23, 42, 0.4); }
html.dark .dark\\:bg-slate-900\\/50 { background-color: rgba(15, 23, 42, 0.5); }
html.dark .dark\\:bg-slate-900\\/60 { background-color: rgba(15, 23, 42, 0.6); }
html.dark .dark\\:bg-slate-900\\/70 { background-color: rgba(15, 23, 42, 0.7); }
html.dark .dark\\:bg-slate-900\\/80 { background-color: rgba(15, 23, 42, 0.8); }
html.dark .dark\\:bg-slate-900\\/90 { background-color: rgba(15, 23, 42, 0.9); }

html.dark .dark\\:bg-slate-950 { background-color: #020617; }
html.dark .dark\\:bg-slate-950\\/40 { background-color: rgba(2, 6, 23, 0.4); }
html.dark .dark\\:bg-slate-950\\/60 { background-color: rgba(2, 6, 23, 0.6); }
html.dark .dark\\:bg-slate-950\\/70 { background-color: rgba(2, 6, 23, 0.7); }
html.dark .dark\\:bg-slate-950\\/80 { background-color: rgba(2, 6, 23, 0.8); }
html.dark .dark\\:bg-slate-950\\/90 { background-color: rgba(2, 6, 23, 0.9); }
html.dark .dark\\:bg-slate-950\\/95 { background-color: rgba(2, 6, 23, 0.95); }

html.dark .dark\\:bg-sky-950\\/20 { background-color: rgba(8, 47, 73, 0.2); }
html.dark .dark\\:bg-sky-950\\/60 { background-color: rgba(8, 47, 73, 0.6); }
html.dark .dark\\:bg-sky-950\\/80 { background-color: rgba(8, 47, 73, 0.8); }

html.dark .dark\\:bg-emerald-950\\/30 { background-color: rgba(6, 78, 59, 0.3); }

html.dark .dark\\:bg-rose-950\\/20 { background-color: rgba(76, 5, 25, 0.2); }
html.dark .dark\\:bg-rose-950\\/30 { background-color: rgba(76, 5, 25, 0.3); }
html.dark .dark\\:bg-rose-950\\/60 { background-color: rgba(76, 5, 25, 0.6); }

html.dark .dark\\:bg-amber-950\\/30 { background-color: rgba(69, 26, 3, 0.3); }
html.dark .dark\\:bg-amber-950\\/40 { background-color: rgba(69, 26, 3, 0.4); }
html.dark .dark\\:bg-amber-950\\/60 { background-color: rgba(69, 26, 3, 0.6); }

/* ==========================================================================
   TYPOGRAPHY
   ========================================================================== */
.font-sans { font-family: var(--font-sans); }
.font-mono { font-family: var(--font-mono); }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }

.text-\\[10px\\] { font-size: 10px; line-height: 14px; }
.text-\\[11px\\] { font-size: 11px; line-height: 16px; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.whitespace-nowrap { white-space: nowrap; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.leading-snug { line-height: 1.375; }
.leading-relaxed { line-height: 1.625; }

/* Text colors */
.text-white { color: #ffffff; }
.text-slate-100 { color: #f1f5f9; }
.text-slate-200 { color: #e2e8f0; }
.text-slate-300 { color: #cbd5e1; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-800 { color: #1e293b; }
.text-slate-900 { color: #0f172a; }
.text-slate-950 { color: #020617; }

.text-sky-300 { color: #7dd3fc; }
.text-sky-400 { color: #38bdf8; }
.text-sky-500 { color: #0ea5e9; }
.text-sky-600 { color: #0284c7; }
.text-sky-700 { color: #0369a1; }
.text-sky-800 { color: #075985; }
.text-sky-900 { color: #0c4a6e; }

.text-emerald-400 { color: #34d399; }
.text-emerald-500 { color: #10b981; }
.text-emerald-600 { color: #059669; }
.text-emerald-900 { color: #064e3b; }

.text-rose-500 { color: #f43f5e; }
.text-rose-600 { color: #e11d48; }
.text-rose-700 { color: #be123c; }
.text-rose-800 { color: #9f1239; }
.text-rose-900 { color: #881337; }

.text-amber-400 { color: #fbbf24; }
.text-amber-500 { color: #f59e0b; }
.text-amber-700 { color: #b45309; }
.text-amber-800 { color: #92400e; }
.text-amber-900 { color: #78350f; }

/* Dark mode text colors */
html.dark .dark\\:text-white { color: #ffffff; }
html.dark .dark\\:text-slate-100 { color: #f1f5f9; }
html.dark .dark\\:text-slate-200 { color: #e2e8f0; }
html.dark .dark\\:text-slate-300 { color: #cbd5e1; }
html.dark .dark\\:text-slate-400 { color: #94a3b8; }
html.dark .dark\\:text-slate-600 { color: #475569; }
html.dark .dark\\:text-sky-200 { color: #bae6fd; }
html.dark .dark\\:text-sky-300 { color: #7dd3fc; }
html.dark .dark\\:text-sky-400 { color: #38bdf8; }
html.dark .dark\\:text-emerald-200 { color: #a7f3d0; }
html.dark .dark\\:text-emerald-400 { color: #34d399; }
html.dark .dark\\:text-rose-200 { color: #fecdd3; }
html.dark .dark\\:text-rose-300 { color: #fda4af; }
html.dark .dark\\:text-rose-400 { color: #fb7185; }
html.dark .dark\\:text-amber-200 { color: #fde68a; }
html.dark .dark\\:text-amber-300 { color: #fcd34d; }

/* ==========================================================================
   SHADOWS & FOCUS
   ========================================================================== */
.shadow-2xs { box-shadow: 0 1px rgb(0 0 0 / 0.05); }
.shadow-xs { box-shadow: var(--shadow-xs); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-2xl { box-shadow: var(--shadow-2xl); }

.focus\\:outline-hidden:focus { outline: none; }
.focus\\:ring-1:focus { box-shadow: 0 0 0 1px #0ea5e9; }
.focus\\:ring-sky-500:focus { box-shadow: 0 0 0 1px #0ea5e9; }

/* ==========================================================================
   HOVER & ACTIVE STATES
   ========================================================================== */
.hover\\:bg-slate-50:hover { background-color: #f8fafc; }
.hover\\:bg-slate-50\\/50:hover { background-color: rgba(248, 250, 252, 0.5); }
.hover\\:bg-slate-100:hover { background-color: #f1f5f9; }
.hover\\:bg-slate-200:hover { background-color: #e2e8f0; }
.hover\\:bg-slate-200\\/50:hover { background-color: rgba(226, 232, 240, 0.5); }
.hover\\:bg-slate-200\\/60:hover { background-color: rgba(226, 232, 240, 0.6); }
.hover\\:bg-slate-200\\/70:hover { background-color: rgba(226, 232, 240, 0.7); }
.hover\\:bg-slate-700\\/80:hover { background-color: rgba(51, 65, 85, 0.8); }
.hover\\:bg-slate-800:hover { background-color: #1e293b; }
.hover\\:bg-sky-400:hover { background-color: #38bdf8; }
.hover\\:bg-sky-500:hover { background-color: #0ea5e9; }
.hover\\:bg-emerald-500:hover { background-color: #10b981; }

.hover\\:text-slate-600:hover { color: #475569; }
.hover\\:text-slate-700:hover { color: #334155; }
.hover\\:text-slate-800:hover { color: #1e293b; }
.hover\\:text-slate-900:hover { color: #0f172a; }
.hover\\:text-white:hover { color: #ffffff; }
.hover\\:text-sky-600:hover { color: #0284c7; }
.hover\\:text-sky-800:hover { color: #075985; }

.hover\\:border-sky-300:hover { border-color: #7dd3fc; }
.hover\\:border-sky-400:hover { border-color: #38bdf8; }
.hover\\:shadow-xs:hover { box-shadow: var(--shadow-xs); }
.hover\\:shadow-md:hover { box-shadow: var(--shadow-md); }

/* Dark Mode Hovers */
html.dark .dark\\:hover\\:bg-slate-700:hover { background-color: #334155; }
html.dark .dark\\:hover\\:bg-slate-800:hover { background-color: #1e293b; }
html.dark .dark\\:hover\\:bg-slate-800\\/50:hover { background-color: rgba(30, 41, 59, 0.5); }
html.dark .dark\\:hover\\:bg-slate-900:hover { background-color: #0f172a; }
html.dark .dark\\:hover\\:bg-slate-900\\/30:hover { background-color: rgba(15, 23, 42, 0.3); }
html.dark .dark\\:hover\\:bg-slate-900\\/40:hover { background-color: rgba(15, 23, 42, 0.4); }
html.dark .dark\\:hover\\:bg-slate-900\\/60:hover { background-color: rgba(15, 23, 42, 0.6); }

html.dark .dark\\:hover\\:text-slate-200:hover { color: #e2e8f0; }
html.dark .dark\\:hover\\:text-sky-300:hover { color: #7dd3fc; }
html.dark .dark\\:hover\\:text-sky-400:hover { color: #38bdf8; }

html.dark .dark\\:hover\\:border-slate-700:hover { border-color: #334155; }
html.dark .dark\\:hover\\:border-sky-600:hover { border-color: #0284c7; }

/* Group Hovers */
.group:hover .group-hover\\:bg-sky-50 { background-color: #f0f9ff; }
.group:hover .group-hover\\:border-sky-500 { border-color: #0ea5e9; }
.group:hover .group-hover\\:text-sky-500 { color: #0ea5e9; }
.group:hover .group-hover\\:text-sky-600 { color: #0284c7; }
.group:hover .group-hover\\:text-slate-600 { color: #475569; }

html.dark .group:hover .dark\\:group-hover\\:bg-sky-950 { background-color: #082f49; }
html.dark .group:hover .dark\\:group-hover\\:text-sky-400 { color: #38bdf8; }
html.dark .group:hover .dark\\:group-hover\\:text-slate-300 { color: #cbd5e1; }

/* ==========================================================================
   RESPONSIVE BREAKPOINTS (sm: 640px, md: 768px, lg: 1024px)
   ========================================================================== */
@media (min-width: 640px) {
  .sm\\:block { display: block; }
  .sm\\:flex { display: flex; }
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:flex-nowrap { flex-wrap: nowrap; }
  .sm\\:inline { display: inline; }
  .sm\\:inline-block { display: inline-block; }
  .sm\\:inline-flex { display: inline-flex; }
  .sm\\:hidden { display: none; }

  .sm\\:items-center { align-items: center; }
  .sm\\:justify-center { justify-content: center; }

  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

  .sm\\:gap-2 { gap: 0.5rem; }
  .sm\\:gap-3 { gap: 0.75rem; }
  .sm\\:gap-4 { gap: 1rem; }

  .sm\\:p-3 { padding: 0.75rem; }
  .sm\\:p-10 { padding: 2.5rem; }
  .sm\\:px-0 { padding-left: 0px; padding-right: 0px; }
  .sm\\:px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .sm\\:px-4 { padding-left: 1rem; padding-right: 1rem; }
  .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .sm\\:pt-1 { padding-top: 0.25rem; }
  .sm\\:pt-24 { padding-top: 6rem; }

  .sm\\:mx-0 { margin-left: 0px; margin-right: 0px; }
  .sm\\:mx-6 { margin-left: 1.5rem; margin-right: 1.5rem; }

  .sm\\:w-16 { width: 4rem; }
  .sm\\:w-80 { width: 20rem; }

  .sm\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .sm\\:text-base { font-size: 1rem; line-height: 1.5rem; }
  .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .sm\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .sm\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
  .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .sm\\:text-right { text-align: right; }
}

@media (min-width: 768px) {
  .md\\:block { display: block; }
  .md\\:flex { display: flex; }
  .md\\:hidden { display: none; }
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:block { display: block; }
  .lg\\:flex { display: flex; }
  .lg\\:flex-row { flex-direction: row; }
  .lg\\:hidden { display: none; }
  .lg\\:sticky { position: sticky; }
  .lg\\:translate-x-0 { transform: translateX(0px); }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  .lg\\:text-base { font-size: 1rem; line-height: 1.5rem; }
  .lg\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .lg\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .lg\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
}

/* ==========================================================================
   CUSTOM APP STYLES & SPECIAL COMPONENTS
   ========================================================================== */
.hero-banner-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 2rem;
  background: linear-gradient(135deg, #091a32 0%, #030816 100%);
  border: 1px solid #1e293b;
  color: #ffffff;
  box-shadow: var(--shadow-md);
}

.katex-block {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  color: #0f172a;
}
html.dark .katex-block {
  background-color: #0d1527;
  border-color: #1e293b;
  color: #f8fafc;
}
.katex-block .katex-display {
  margin: 0 !important;
  color: inherit !important;
}
.katex-block .katex {
  color: inherit !important;
}
.katex-html {
  color: inherit !important;
}

/* Code block highlight styling */
.code-block-wrapper pre code {
  color: #f8fafc;
  font-family: var(--font-mono);
}
"""
    CSS_FILE.write_text(css, encoding="utf-8")
    print(f"Generated {CSS_FILE} ({len(css)} bytes)")

if __name__ == "__main__":
    generate_css()
