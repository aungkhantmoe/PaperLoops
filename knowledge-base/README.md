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

