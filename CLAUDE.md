# Project: Repeat Image with Different QR Codes

## Overview
Free, client-side web app that generates multi-page PDFs with unique QR codes overlaid on a repeated template image or PDF. 100% browser-based (no backend), privacy-first, works offline after initial load.

Live: https://www.repeat-image-with-different-qr.codes/

## Tech Stack
- React 18 + TypeScript + Vite
- **pdf-lib** — PDF generation
- **qr-code-styling** — QR code rendering with custom styles
- **pdfjs-dist** — PDF template preview/rendering
- **idb-keyval** — IndexedDB persistence
- **PapaParse** — CSV parsing
- **react-router-dom v7** — routing

## Commands
```bash
npm run dev      # dev server at localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Architecture

### Routing
Two routes: `/` (landing page) and `/tool` (main tool).

### State
All app state lives in [src/App.tsx](src/App.tsx) as a `DocumentModel`. Auto-saved to IndexedDB with a 1s debounce.

### Units
All internal dimensions are stored as **PostScript points** (1/72 inch). Use [src/utils/units.ts](src/utils/units.ts) for conversion from cm/in/mm.

## Source Structure

```
src/
├── App.tsx              # Central state, storage, export orchestration
├── constants.ts         # 30+ page size presets, default DocumentModel
├── types/index.ts       # All TypeScript interfaces
├── pages/
│   ├── LandingPage.tsx
│   └── ToolPage.tsx
├── components/
│   ├── Preview.tsx          # WYSIWYG canvas preview, drag-drop QR positioning
│   ├── PageSettings.tsx     # Page size, units, margins
│   ├── QRSettings.tsx       # QR code style and positioning
│   ├── LabelSettings.tsx    # Label fonts, colors, backgrounds
│   ├── DataInput.tsx        # URL/CSV data entry
│   ├── TemplateManager.tsx  # Save/load/delete/export/import templates
│   ├── TemplatePlacement.tsx # Template fit mode and offset controls
│   └── TemplateUpload.tsx   # Template file upload
└── utils/
    ├── pdfExporter.ts    # PDF generation pipeline
    ├── qrGenerator.ts    # QR image creation (4x resolution for print quality)
    ├── canvasRenderer.ts # WYSIWYG preview rendering
    ├── dataProcessor.ts  # URL/CSV parsing, label variable substitution
    ├── storage.ts        # IndexedDB CRUD (draft, templates, blobs)
    ├── validation.ts     # Per-row data validation
    ├── template.ts       # Label template variable rendering
    └── units.ts          # Unit conversion utilities
```

## Key Conventions

### QR Positioning (dual-anchor system)
- **Canvas anchor**: which point on the page to position from
- **QR anchor**: which point of the QR code aligns to the canvas anchor

### Label Template Variables
`{index}`, `{id}`, `{col:ColumnName}` — e.g. `SKU: {col:sku} - {col:name}`

### Template Persistence
Templates saved as `TemplateBundle` (DocumentModel + image/logo blobs + metadata) in IndexedDB.

### Margin System
Three nested zones: bleed → canvas/trim → safe area. Visual overlays use red dashed (bleed), blue dashed (trim), green solid (safe) lines.

### Canvas Preview
Checkerboard background, debounced re-renders, 4x scale for quality.
