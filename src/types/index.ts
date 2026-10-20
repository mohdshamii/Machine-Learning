export interface HeadingItem {
  level: number;
  title: string;
  id: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  subjectId: string;
  format: 'notebook' | 'markdown' | 'pdf';
  fileName: string;
  relativePath: string;
  githubBlobUrl?: string;
  githubRawUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Reference' | string;
  tags: string[];
  prerequisites?: string[];
  description: string;
  estimatedMinutes: number;
  cellCount?: number;
  codeCellCount?: number;
  headings: HeadingItem[];
  searchTokens?: string;
  hasNotebook: boolean;
  sizeBytes?: number;
  sizeMB?: number;
  isOriginalMaterial?: boolean;
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  lessons: LessonSummary[];
}

export interface NotebookOutput {
  output_type: string;
  text?: string[] | string;
  name?: string;
  data?: {
    'text/plain'?: string[] | string;
    'text/html'?: string[] | string;
    'image/png'?: string;
    'image/jpeg'?: string;
    'image/svg+xml'?: string[] | string;
    'image/gif'?: string;
    [mime: string]: any;
  };
  traceback?: string[];
  execution_count?: number | null;
  ename?: string;
  evalue?: string;
}

export interface NotebookCell {
  id: string;
  cell_type: 'code' | 'markdown' | 'raw';
  execution_count?: number | null;
  source: string;
  outputs?: NotebookOutput[];
  metadata?: Record<string, any>;
  attachments?: Record<string, Record<string, string>>;
}

export interface LessonDetail extends LessonSummary {
  content?: string;
  cells?: NotebookCell[];
  pdfUrl?: string;
  frontmatter?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface IndexStats {
  totalSubjects: number;
  totalLessons: number;
  totalNotebooks: number;
  totalMarkdownNotes: number;
  totalPdfs: number;
}

export interface ProjectIndex {
  projectTitle: string;
  author: string;
  stats: IndexStats;
  subjects: Subject[];
  allLessons: LessonSummary[];
}

export interface QuickRevisionCard {
  id: string;
  title: string;
  subject: string;
  formula?: string;
  summary: string;
  pitfall: string;
  codeSnippet?: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}
