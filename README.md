# MLVault - Machine Learning tutorial plateform
> An interactive, expandable Machine Learning study hub and Jupyter-inspired workspace, built with React, Vite, and TypeScript. Ready for instant deployment on GitHub Pages.

**Author:** [Mohd Shami](https://github.com/codexshami)  
**Repository:** [codexshami/MLVault](https://github.com/codexshami/MLVault)  
**Live Site:** Hosted on GitHub Pages via automated GitHub Actions

---

## Highlights & Features

- **Jupyter Notebook-Inspired UI:**
  - Authentic notebook workspace aesthetics with clean borders, typography, and muted metadata.
  - Native rendering of `.ipynb` files preserving Markdown, Python code, execution prompts (`In [1]:`), output streams, base64 Matplotlib/Seaborn plots, styled Pandas DataFrames, and tracebacks.
  - Interactive code blocks with copy-to-clipboard, line numbering, and syntax highlighting.
  - Mathematical typesetting powered by KaTeX ($LaTeX$ equations inline and display mode).
- **Comprehensive 21-Subject Curriculum:**
  - Structured modular curriculum from Python & Math foundations to Transformers, MLOps, and GATE DA revision.
  - Auto-discovery system that scans content folders and rebuilds the static catalog without touching UI code.
- **Study & Revision Experience:**
  - **Global Fuzzy Search (`Ctrl + K`):** Instant search across lesson titles, descriptions, tags, and cell texts.
  - **Interactive Practice:** 3D flip flashcards, multiple-choice questions (MCQs) with instant explanations, and top ML pitfall audits.
  - **Progress Tracking & Bookmarks:** Track completed lessons and bookmark key formulas locally via `localStorage`.
  - **High-Yield Cheat Sheets:** GATE Data Science & AI syllabus formula sheet and top 50 interview questions with derivations.
- **Zero-Loss Asset Preservation:**
  - 100% of original notebooks (`data cleaning`, `feature scaling`, `supervised ml`, `Unsupervised`) and reference PDFs are preserved in place and mapped directly into the catalogue.
- **GitHub Pages Ready:**
  - Built with relative base paths (`./`) and automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

---

## Repository & Folder Organization

```text
machinelearning/
├── index.html                      # Entry HTML with KaTeX and Google Fonts
├── README.md                       # Documentation & guide
├── package.json                    # Dependencies & build scripts
├── vite.config.ts                  # Vite build configuration with relative base
├── tsconfig.json                   # TypeScript compiler options
├── .gitignore                      # Git ignore rules for node_modules, dist, etc.
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD deployment
│
├── public/
│   ├── favicon.svg                 # Custom Jupyter/Neural SVG icon
│   ├── data/                       # Built-time search index
│   ├── content-data/               # Pre-parsed static JSON payloads for fast page loads
│   └── raw-notebooks/              # Raw .ipynb files for direct user download
│
├── src/
│   ├── components/                 # TopNav, Sidebar, NotebookViewer, TableOfContents, etc.
│   ├── pages/                      # HomeDashboard, LessonPage
│   ├── styles/                     # Modern vanilla CSS design system & Jupyter styles
│   ├── types/                      # TypeScript data definitions
│   └── utils/                      # Storage, ANSI parser, Markdown/KaTeX renderer
│
├── content/                        # Curated 21-topic modular study curriculum
│   ├── 00-Python-for-ML/
│   ├── 01-Mathematics/
│   ├── 02-Statistics-and-Probability/
│   ├── 03-Data-Analysis/
│   ├── 04-Data-Preprocessing/
│   ├── 05-Exploratory-Data-Analysis/
│   ├── 06-Supervised-Learning/
│   ├── 07-Unsupervised-Learning/
│   ├── 08-Feature-Engineering/
│   ├── 09-Model-Evaluation/
│   ├── 10-Ensemble-Learning/
│   ├── 11-Deep-Learning/
│   ├── 12-Neural-Networks/
│   ├── 13-NLP/
│   ├── 14-Computer-Vision/
│   ├── 15-Time-Series/
│   ├── 16-Reinforcement-Learning/
│   ├── 17-MLOps-and-Deployment/
│   ├── 18-Projects/
│   ├── 19-GATE-DA-Revision/
│   └── 20-Interview-Preparation/
│
├── scripts/
│   └── build-content-index.py      # Automated Python discovery script
│
└── [Original Study Materials]       # 100% Preserved original labs & lecture PDFs
    ├── data cleaning/              # data_clean.ipynb, Titanic-Dataset.csv
    ├── feature scaling/            # feature scaling.ipynb, SampleFile.csv
    ├── supervised ml/              # housepriceusingLR.ipynb, linear_regression_A.gif
    ├── Unsupervised/               # Hierarchial_Clustering.ipynb, K-Mean Clustering.ipynb
    └── *.pdf                       # 13 Reference PDFs (Cheat sheets, handwritten notes, etc.)
```

---

## How to Add New Content (Automated Discovery)

This repository is built for long-term growth. Adding new study notes or Jupyter notebooks requires **no code changes**:

### Step 1: Add your file
Place your `.ipynb` notebook, `.md` markdown notes, or `.pdf` file in the appropriate `content/<subject-folder>/`:
```text
content/06-Supervised-Learning/my-new-algorithm.md
```

### Step 2: (Optional) Add Metadata Frontmatter for Markdown
For `.md` files, you can define optional frontmatter:
```yaml
---
title: "Support Vector Machines (SVM) & Kernel Methods"
subject: "06-Supervised-Learning"
difficulty: "Intermediate"
tags: ["svm", "kernel-trick", "margin", "supervised"]
prerequisites: ["01-Mathematics"]
description: "Derive maximum-margin hyperplanes, dual Lagrangian formulation, and RBF kernels."
---
```

For Jupyter notebooks (`.ipynb`), the discovery script automatically extracts headings, cell counts, code blocks, and outputs!

### Step 3: Run the Indexer & Build
```bash
python scripts/build-content-index.py
npm run build
```
The new lesson will automatically appear in the course tree, global search index, and dashboard overview.

---

## Local Development Workflow

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Installation
```bash
git clone https://github.com/mohdshamii.github.io/Machine-Learning.git
cd machinelearning
npm install
```

### Run Locally (Development Server)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Test Production Build Locally
```bash
npm run build
npm run preview
```

---

##  GitHub Pages Deployment

The repository includes a production GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy automatically:
1. Push your changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Add new learning materials and update study hub"
   git push origin main
   ```
2. In your GitHub repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. GitHub Actions will automatically index content, build the static bundle, and deploy to:
   ```text
   https://mohdshamii.github.io/Machine-Learning/
   ```

---

##  Quality & Compatibility Guarantee

- **Relative Paths:** Uses `./` base resolution to prevent broken styles or 404 script errors regardless of whether deployed to a custom domain or a repository subdirectory (`/MLVault/`).
- **Safe Rendering:** Notebook HTML and SVG outputs are sanitized; scripts are not executed.
- **Fast Client Performance:** Pre-parsed JSON chunks ensure immediate initial load times without parsing multi-megabyte notebooks upfront.
- **Persistent Progress:** Bookmarks and completed lessons are saved in your browser's `localStorage`.

---

##  License
Curated for personal and community learning. Original study materials and notes are credited to their respective authors and [Mohd Shami](https://github.com/codexshami).
