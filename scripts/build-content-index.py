#!/usr/bin/env python3
"""
scripts/build-content-index.py
Builds the static search index and normalized lesson payloads for MLVault.
Scans content/ directory, legacy project folders, and root reference materials.
"""

import os
import sys
import json
import re
import glob
import shutil
from pathlib import Path

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT_DIR / "content"
PUBLIC_DIR = ROOT_DIR / "public"
CONTENT_DATA_DIR = PUBLIC_DIR / "content-data"
RAW_NOTEBOOKS_DIR = PUBLIC_DIR / "raw-notebooks"
SRC_DATA_DIR = ROOT_DIR / "src" / "data"

# Standard subjects order and human-readable names
SUBJECT_METADATA = {
    "00-Python-for-ML": {"name": "Python for ML", "icon": "Code2", "color": "#0284c7"},
    "01-Mathematics": {"name": "Mathematics for ML", "icon": "Binary", "color": "#2563eb"},
    "02-Statistics-and-Probability": {"name": "Statistics & Probability", "icon": "Sigma", "color": "#7c3aed"},
    "03-Data-Analysis": {"name": "Data Analysis (Pandas & NumPy)", "icon": "TableProperties", "color": "#0891b2"},
    "04-Data-Preprocessing": {"name": "Data Preprocessing", "icon": "Filter", "color": "#0d9488"},
    "05-Exploratory-Data-Analysis": {"name": "Exploratory Data Analysis (EDA)", "icon": "BarChart3", "color": "#059669"},
    "06-Supervised-Learning": {"name": "Supervised Learning", "icon": "TrendingUp", "color": "#16a34a"},
    "07-Unsupervised-Learning": {"name": "Unsupervised Learning", "icon": "Network", "color": "#ca8a04"},
    "08-Feature-Engineering": {"name": "Feature Engineering & Scaling", "icon": "Sliders", "color": "#d97706"},
    "09-Model-Evaluation": {"name": "Model Evaluation & Metrics", "icon": "Gauge", "color": "#ea580c"},
    "10-Ensemble-Learning": {"name": "Ensemble Learning & Boosting", "icon": "Layers", "color": "#dc2626"},
    "11-Deep-Learning": {"name": "Deep Learning Foundations", "icon": "Cpu", "color": "#9333ea"},
    "12-Neural-Networks": {"name": "Neural Networks & Architectures", "icon": "Boxes", "color": "#c026d3"},
    "13-NLP": {"name": "Natural Language Processing (NLP)", "icon": "BookOpenText", "color": "#db2777"},
    "14-Computer-Vision": {"name": "Computer Vision (CV)", "icon": "Eye", "color": "#e11d48"},
    "15-Time-Series": {"name": "Time Series Forecasting", "icon": "Activity", "color": "#0284c7"},
    "16-Reinforcement-Learning": {"name": "Reinforcement Learning", "icon": "Gamepad2", "color": "#2563eb"},
    "17-MLOps-and-Deployment": {"name": "MLOps & Model Deployment", "icon": "ServerCog", "color": "#4f46e5"},
    "18-Projects": {"name": "Hands-On Real-World Projects", "icon": "FolderGit2", "color": "#0d9488"},
    "19-GATE-DA-Revision": {"name": "GATE Data Science & AI Revision", "icon": "GraduationCap", "color": "#d97706"},
    "20-Interview-Preparation": {"name": "Interview Prep & CheatSheets", "icon": "CheckCircle2", "color": "#16a34a"}
}

def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def parse_yaml_frontmatter(content: str):
    metadata = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2]
            for line in fm_text.splitlines():
                if ":" in line:
                    key, val = line.split(":", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if val.startswith("[") and val.endswith("]"):
                        # parse simple string list
                        val = [item.strip().strip('"').strip("'") for item in val[1:-1].split(",") if item.strip()]
                    metadata[key] = val
    return metadata, body

def extract_headings(text: str):
    headings = []
    for line in text.splitlines():
        m = re.match(r'^(#{1,4})\s+(.+)$', line.strip())
        if m:
            level = len(m.group(1))
            title = m.group(2).strip()
            # Clean markdown formatting inside heading
            clean_title = re.sub(r'[*_`]', '', title)
            headings.append({
                "level": level,
                "title": clean_title,
                "id": slugify(clean_title)
            })
    return headings

def process_markdown_file(file_path: Path, subject_id: str):
    try:
        raw_text = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

    meta, body = parse_yaml_frontmatter(raw_text)
    headings = extract_headings(body)
    
    # Title resolution
    title = meta.get("title")
    if not title:
        if headings:
            title = headings[0]["title"]
        else:
            title = file_path.stem.replace("-", " ").replace("_", " ").title()

    file_id = slugify(f"{subject_id}-{file_path.stem}")
    tags = meta.get("tags", [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]

    description = meta.get("description", "")
    if not description:
        # Grab first non-heading paragraph
        paragraphs = [p.strip() for p in body.split("\n\n") if p.strip() and not p.strip().startswith("#")]
        if paragraphs:
            description = paragraphs[0][:200] + ("..." if len(paragraphs[0]) > 200 else "")

    words = len(body.split())
    est_minutes = max(1, round(words / 180))

    lesson_summary = {
        "id": file_id,
        "title": title,
        "subjectId": subject_id,
        "format": "markdown",
        "fileName": file_path.name,
        "relativePath": str(file_path.relative_to(ROOT_DIR)).replace("\\", "/"),
        "difficulty": meta.get("difficulty", "Intermediate"),
        "tags": tags,
        "prerequisites": meta.get("prerequisites", []),
        "description": description,
        "estimatedMinutes": est_minutes,
        "headings": headings,
        "searchTokens": f"{title} {description} {' '.join(tags)} {body[:1500]}",
        "hasNotebook": False,
        "sizeBytes": file_path.stat().st_size
    }

    full_payload = {
        **lesson_summary,
        "content": body,
        "frontmatter": meta
    }

    return lesson_summary, full_payload

def process_notebook_file(file_path: Path, subject_id: str):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            nb = json.load(f)
    except Exception as e:
        print(f"Error parsing notebook {file_path}: {e}")
        return None

    cells = nb.get("cells", [])
    headings = []
    full_text_parts = []
    code_cells_count = 0
    markdown_cells_count = 0
    extracted_title = None

    normalized_cells = []
    for idx, c in enumerate(cells):
        cell_type = c.get("cell_type", "raw")
        source = "".join(c.get("source", []))
        if cell_type == "markdown":
            markdown_cells_count += 1
            full_text_parts.append(source)
            cell_headings = extract_headings(source)
            headings.extend(cell_headings)
            if not extracted_title and cell_headings:
                extracted_title = cell_headings[0]["title"]
        elif cell_type == "code":
            code_cells_count += 1
            full_text_parts.append(source)

        normalized_cell = {
            "id": f"cell-{idx}",
            "cell_type": cell_type,
            "execution_count": c.get("execution_count"),
            "source": source,
            "outputs": c.get("outputs", []),
            "metadata": c.get("metadata", {}),
            "attachments": c.get("attachments", {})
        }
        normalized_cells.append(normalized_cell)

    if not extracted_title:
        extracted_title = file_path.stem.replace("-", " ").replace("_", " ").title()

    file_id = slugify(f"{subject_id}-{file_path.stem}")
    words = sum(len(c["source"].split()) for c in normalized_cells)
    est_minutes = max(3, round((words / 150) + (code_cells_count * 1.5)))

    # Inferred tags
    tags = [subject_id.split("-", 1)[-1].lower().replace("-", " ")]
    if "clean" in file_path.stem.lower():
        tags.extend(["data cleaning", "imputation", "preprocessing"])
    elif "scaling" in file_path.stem.lower():
        tags.extend(["feature scaling", "normalization", "standardization"])
    elif "cluster" in file_path.stem.lower():
        tags.extend(["clustering", "unsupervised", "kmeans"])
    elif "regress" in file_path.stem.lower():
        tags.extend(["regression", "gradient descent", "supervised"])

    description = f"Interactive Jupyter notebook covering {extracted_title}. Contains {code_cells_count} executable code cells and {markdown_cells_count} explanation sections."

    lesson_summary = {
        "id": file_id,
        "title": extracted_title,
        "subjectId": subject_id,
        "format": "notebook",
        "fileName": file_path.name,
        "relativePath": str(file_path.relative_to(ROOT_DIR)).replace("\\", "/"),
        "difficulty": "Intermediate",
        "tags": list(set(tags)),
        "prerequisites": [],
        "description": description,
        "estimatedMinutes": est_minutes,
        "cellCount": len(cells),
        "codeCellCount": code_cells_count,
        "headings": headings,
        "searchTokens": f"{extracted_title} {description} {' '.join(tags)} {' '.join(full_text_parts[:10])[:2000]}",
        "hasNotebook": True,
        "sizeBytes": file_path.stat().st_size
    }

    full_payload = {
        **lesson_summary,
        "cells": normalized_cells,
        "nbformat": nb.get("nbformat", 4),
        "nbformat_minor": nb.get("nbformat_minor", 2),
        "metadata": nb.get("metadata", {})
    }

    # Copy raw notebook to public/raw-notebooks for download
    try:
        dest_raw = RAW_NOTEBOOKS_DIR / f"{file_id}.ipynb"
        shutil.copy2(file_path, dest_raw)
    except Exception as e:
        print(f"Warning: could not copy raw notebook {file_path}: {e}")

    return lesson_summary, full_payload

def process_pdf_file(file_path: Path, subject_id: str):
    import urllib.parse
    clean_name = file_path.stem.replace("📝", "").replace("??", "").strip()
    clean_name = re.sub(r'\s+', ' ', clean_name)
    file_id = slugify(f"pdf-{clean_name}")
    size_mb = file_path.stat().st_size / (1024 * 1024)
    quoted_name = urllib.parse.quote(file_path.name)
    github_blob_url = f"https://github.com/codexshami/MLVault/blob/main/{quoted_name}"
    github_raw_url = f"https://github.com/codexshami/MLVault/raw/main/{quoted_name}"

    lesson_summary = {
        "id": file_id,
        "title": f"{clean_name} (Reference PDF)",
        "subjectId": subject_id,
        "format": "pdf",
        "fileName": file_path.name,
        "relativePath": str(file_path.relative_to(ROOT_DIR)).replace("\\", "/"),
        "githubBlobUrl": github_blob_url,
        "githubRawUrl": github_raw_url,
        "difficulty": "Reference",
        "tags": ["pdf", "notes", "handbook", "reference"],
        "prerequisites": [],
        "description": f"Original study notes and PDF reference document ({size_mb:.1f} MB).",
        "estimatedMinutes": max(5, int(size_mb * 5)),
        "headings": [],
        "searchTokens": f"{clean_name} pdf notes reference {subject_id}",
        "hasNotebook": False,
        "sizeBytes": file_path.stat().st_size,
        "sizeMB": round(size_mb, 2)
    }

    full_payload = {
        **lesson_summary,
        "pdfUrl": github_raw_url,
        "githubBlobUrl": github_blob_url,
        "localPath": str(file_path.relative_to(ROOT_DIR)).replace("\\", "/")
    }

    return lesson_summary, full_payload

def scan_all_content():
    print("--- Scanning MLVault Content ---")
    CONTENT_DATA_DIR.mkdir(parents=True, exist_ok=True)
    RAW_NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    SRC_DATA_DIR.mkdir(parents=True, exist_ok=True)

    all_lessons = []
    subjects_dict = {}

    # Initialize all standard subjects
    for sid, info in SUBJECT_METADATA.items():
        subjects_dict[sid] = {
            "id": sid,
            "title": info["name"],
            "icon": info["icon"],
            "color": info["color"],
            "lessons": []
        }

    # 1. Scan content/ directory
    if CONTENT_DIR.exists():
        for subject_dir in sorted(CONTENT_DIR.iterdir()):
            if subject_dir.is_dir() and not subject_dir.name.startswith("."):
                sid = subject_dir.name
                if sid not in subjects_dict:
                    subjects_dict[sid] = {
                        "id": sid,
                        "title": sid.replace("-", " ").title(),
                        "icon": "BookOpen",
                        "color": "#0284c7",
                        "lessons": []
                    }
                
                # Check for files
                for file_path in sorted(subject_dir.glob("*")):
                    if file_path.is_file() and not file_path.name.startswith("."):
                        ext = file_path.suffix.lower()
                        result = None
                        if ext == ".md":
                            result = process_markdown_file(file_path, sid)
                        elif ext == ".ipynb":
                            result = process_notebook_file(file_path, sid)
                        elif ext == ".pdf":
                            result = process_pdf_file(file_path, sid)

                        if result:
                            summary, payload = result
                            all_lessons.append(summary)
                            subjects_dict[sid]["lessons"].append(summary)
                            # Save individual lesson payload
                            payload_file = CONTENT_DATA_DIR / f"{summary['id']}.json"
                            payload_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    # 2. Map legacy existing notebooks and resources
    legacy_mappings = [
        ("data cleaning/data_clean.ipynb", "04-Data-Preprocessing"),
        ("feature scaling/feature scaling.ipynb", "08-Feature-Engineering"),
        ("supervised ml/housepriceusingLR.ipynb", "06-Supervised-Learning"),
        ("Unsupervised/Hierarchial_Clustering.ipynb", "07-Unsupervised-Learning"),
        ("Unsupervised/K-Mean Clustering.ipynb", "07-Unsupervised-Learning"),
    ]

    for rel_path, sid in legacy_mappings:
        p = ROOT_DIR / rel_path
        if p.exists():
            result = process_notebook_file(p, sid)
            if result:
                summary, payload = result
                # Prefix with [Original Notebook] for clarity
                summary["title"] = f"{summary['title']} (Original Lab)"
                summary["isOriginalMaterial"] = True
                all_lessons.append(summary)
                if sid in subjects_dict:
                    subjects_dict[sid]["lessons"].append(summary)
                payload_file = CONTENT_DATA_DIR / f"{summary['id']}.json"
                payload_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    # 3. Map root reference PDFs
    root_pdf_mappings = {
        "Mathematics For Machine Learning .pdf": "01-Mathematics",
        "Matplotlib .pdf": "00-Python-for-ML",
        "Machine Learning in Python.pdf": "00-Python-for-ML",
        "K Means Clustering .pdf": "07-Unsupervised-Learning",
        "Logistic Regression Notes 📝 .pdf": "06-Supervised-Learning",
        "Machine Learning CheatSheet .pdf": "20-Interview-Preparation",
        "Machine Learning Handwritten Notes.pdf": "20-Interview-Preparation",
        "Machine Learning Part_1.pdf": "20-Interview-Preparation",
        "Machine Learning.pdf": "20-Interview-Preparation",
        "Hand-on-ML.pdf": "18-Projects",
        "Machine Learning Yearning .pdf": "18-Projects",
        "FAANG_Full_Stack_AI_ML_Engineer_Roadmap_v3.pdf": "18-Projects",
        "600 Machine Learning Real Worlds Projects 📝 ( Arif ).pdf": "18-Projects",
    }

    for pdf_name, sid in root_pdf_mappings.items():
        p = ROOT_DIR / pdf_name
        if p.exists():
            result = process_pdf_file(p, sid)
            if result:
                summary, payload = result
                summary["isOriginalMaterial"] = True
                all_lessons.append(summary)
                if sid in subjects_dict:
                    subjects_dict[sid]["lessons"].append(summary)
                payload_file = CONTENT_DATA_DIR / f"{summary['id']}.json"
                payload_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    # Clean up empty subjects or keep them in catalogue with empty lessons indicator
    subjects_list = list(subjects_dict.values())

    stats = {
        "totalSubjects": len([s for s in subjects_list if s["lessons"]]),
        "totalLessons": len(all_lessons),
        "totalNotebooks": len([l for l in all_lessons if l["format"] == "notebook"]),
        "totalMarkdownNotes": len([l for l in all_lessons if l["format"] == "markdown"]),
        "totalPdfs": len([l for l in all_lessons if l["format"] == "pdf"]),
    }

    index_data = {
        "projectTitle": "MLVault - Machine Learning Study Hub",
        "author": "Mohd Shami",
        "stats": stats,
        "subjects": subjects_list,
        "allLessons": all_lessons
    }

    # Write to src/data/content-index.json for Vite import
    index_file_src = SRC_DATA_DIR / "content-index.json"
    index_file_src.write_text(json.dumps(index_data, ensure_ascii=False, indent=2), encoding="utf-8")

    # Also write to public/data/content-index.json for runtime dynamic fetch
    (PUBLIC_DIR / "data").mkdir(parents=True, exist_ok=True)
    index_file_pub = PUBLIC_DIR / "data" / "content-index.json"
    index_file_pub.write_text(json.dumps(index_data, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Index successfully built!")
    print(f"Subjects: {len(subjects_list)} | Total items: {len(all_lessons)} (Notebooks: {stats['totalNotebooks']}, Markdown: {stats['totalMarkdownNotes']}, PDFs: {stats['totalPdfs']})")

if __name__ == "__main__":
    scan_all_content()
