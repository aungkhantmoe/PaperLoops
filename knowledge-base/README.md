# PaperLoop knowledge base

This directory separates official source documents from data used by the app.

```text
knowledge-base/
├── raw/
│   ├── syllabus/      # Official MOE and SEAB syllabus documents (not committed)
│   └── past-papers/   # Original past-year papers and answer keys (not committed)
├── manifests/         # Source URLs, versions, dates, and provenance
└── processed/         # Reviewed JSON/JSONL consumed by the application
```

Never place API keys or student data here. Raw PDFs are intentionally ignored by
Git. Their source details remain recorded in `manifests/` so the processed data
can be audited and regenerated.

## Past-paper ingestion

1. Keep each supplied PDF in `raw/past-papers/<year>/`.
2. Record its checksum, page ranges, provenance and review status in
   `manifests/past-paper-sources.json`.
3. Extract and review questions, diagrams, answers and marking steps before
   adding them to the app-ready question bank.
4. Tag each reviewed question against `processed/psle-math-syllabus.json`.

Past papers from before 2026 are references for topic coverage, difficulty,
question construction and marking methods. Generated Exam Mode papers must use
the revised examination format effective from 2026.

