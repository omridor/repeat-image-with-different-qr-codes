# Changelog

## Latest Update - February 2026

### 🎉 Major Updates

#### 1. **Fixed QR Code Rendering**
- Resolved QR code not appearing in preview
- Implemented proper DOM-based rendering for qr-code-styling library
- QR codes now render reliably with all styling options

#### 2. **Improved Preview Legend**
- Made legend text larger and more legible
- Added white background with border for better visibility
- Increased font sizes from 11-12px to 13-16px
- Improved line icon thickness for better visibility
- Legend now clearly explains:
  - 🔴 Red dashed line: Trim/Canvas boundary (inside bleed)
  - 🔵 Blue dashed line: Safe area (critical content zone)
  - 🟢 Green solid line: Image boundary (actual placement)

#### 3. **Fixed Drag Artifacts**
- Eliminated duplicate preview images during QR dragging
- Implemented debounced state updates for smooth dragging
- Added temporary position tracking for immediate visual feedback
- Improved drag detection (only starts when clicking on QR code)

#### 4. **Comprehensive Size Presets** (30+ presets)
Added presets for:
- Business cards (US, EU, Square)
- Labels (Square 2"/3", Rectangle 4"×2", Avery 5160/5163/22806)
- Name badges (3"×4", 4"×3")
- Playing cards (Poker, Bridge, Tarot)
- Gift tags (Small, Large)
- Postcards (US, A6)
- Event tickets (Standard, Wide)
- Bookmarks
- Luggage tags
- Hang tags (Small, Large)
- Wine/bottle labels
- CD/DVD labels

#### 5. **Project Rebranding**
- **New name**: "Repeat Image with Different QR Codes"
- Updated all branding throughout the application
- New package name: `repeat-image-with-different-qr`

#### 6. **SEO-Optimized Landing Page**
Created comprehensive landing page with:
- Hero section with clear value proposition
- Features showcase (6 key features)
- Use cases section (8 common applications)
- How it works (4-step process)
- Comprehensive features list
- FAQ section (10 questions)
- Multiple CTAs
- SEO-friendly content with keywords
- Responsive design

#### 7. **Routing System**
- Implemented React Router for navigation
- Landing page at `/`
- Tool at `/tool`
- "Back to Home" link in tool header
- 404 redirect to landing page

### 📝 Content Improvements

#### Added Bleed & Safe Margin Explanations
In Page Settings panel:
- **Bleed**: Extra area outside canvas that will be cut off during printing. Prevents white edges.
- **Safe Area**: Inner zone where critical content must stay to avoid being cut.

#### Visual Enhancements
- Legend shows actual image boundary in green
- Checkerboard pattern visible everywhere (not just outside trim)
- Better visual hierarchy in overlays

### 🎨 UI/UX Improvements

#### Removed Confusing Options
- Removed "Clip to Trim Area" toggle
- Simplified to single "Show overlay guides & legend" checkbox

#### Enhanced Controls
- Base image rotation: Changed from 0-360° slider to 90° interval radio buttons
- QR rotation: Changed from 0-360° slider to 90° interval radio buttons
- More intuitive rotation controls

#### Advanced Image Placement
Added comprehensive controls:
- **Placement Bounds**: Choose bleed area, canvas, or safe area
- **Fit Modes**: Contain, cover, stretch, fill-width, fill-height
- **Lock Aspect Ratio**: Toggle for fill modes
- **Offset Anchor**: From corner or from center
- **Manual Offsets**: Precise X/Y positioning

### 🐛 Bug Fixes

1. **QR rendering**: Fixed qr-code-styling canvas generation
2. **Drag artifacts**: Eliminated preview duplication during drag
3. **Legend readability**: Increased sizes and added background
4. **Type safety**: Updated all types for new rotation format (0|90|180|270)

### 🔧 Technical Changes

#### Type System Updates
- Added `Rotation` type: `0 | 90 | 180 | 270`
- Added `PlacementBounds`: `'canvas' | 'safe-area' | 'bleed-area'`
- Added `OffsetAnchor`: `'corner' | 'center'`
- Updated `FitMode` with `'fill-width' | 'fill-height'`
- Removed `clipToTrim` from overlays

#### Component Updates
- `canvasRenderer.ts`: Enhanced with new placement logic, legend
- `Preview.tsx`: Improved drag handling with debouncing
- `PageSettings.tsx`: Added explanations, removed confusing options
- `BaseImageSettings.tsx`: Complete redesign with all new controls
- `QRSettings.tsx`: 90° rotation intervals
- `pdfExporter.ts`: Updated for new rotation format

#### New Files
- `src/pages/LandingPage.tsx`: SEO-optimized home page
- `src/pages/LandingPage.css`: Landing page styles
- `src/pages/ToolPage.tsx`: Tool page wrapper
- Routing configured in `main.tsx`

### 📦 Dependencies

Added:
- `react-router-dom` - For routing between landing and tool pages

### 🎯 SEO Improvements

**Landing Page Optimizations**:
- Comprehensive keyword targeting
- Multiple H1/H2/H3 tags with relevant keywords
- 10+ use cases described in detail
- FAQ section answering common questions
- Clear CTAs throughout
- Semantic HTML structure
- Mobile-responsive design

**Keywords Targeted**:
- QR code generator
- Bulk QR code creator
- Multi-page PDF QR codes
- Business card QR codes
- Product label QR codes
- Event ticket generator
- Free QR code tool
- QR code with template

---

## All Features Summary

### ✅ Core Functionality
- [x] Client-side only (no backend)
- [x] Works offline
- [x] IndexedDB persistence
- [x] WYSIWYG preview
- [x] Multi-page PDF export
- [x] Unit conversion (cm/in/mm)

### ✅ Page Configuration
- [x] 30+ size presets
- [x] Custom dimensions
- [x] Bleed margins (linked/unlinked)
- [x] Safe margins (linked/unlinked)
- [x] Visual overlays with legend

### ✅ QR Code Features
- [x] Drag-and-drop positioning
- [x] 5 anchor points
- [x] 90° rotation intervals
- [x] Pattern styles (squares/dots/rounded)
- [x] Custom colors + transparent bg
- [x] Logo embedding
- [x] 4 error correction levels

### ✅ Label Features
- [x] 3 font families
- [x] Custom size/weight/color
- [x] Background boxes
- [x] Text outlines
- [x] Smart wrapping
- [x] 4 orientations

### ✅ Image Placement
- [x] 5 fit modes
- [x] 90° rotation
- [x] Aspect ratio lock
- [x] Offset controls
- [x] Placement bounds selection

### ✅ Data Input
- [x] URL list mode
- [x] CSV mode
- [x] Column mapping
- [x] Label templates
- [x] Variable substitution
- [x] Validation

### ✅ Templates
- [x] Save/load templates
- [x] Export/import as JSON
- [x] Auto-save drafts
- [x] Template metadata

### ✅ Landing Page
- [x] SEO-optimized content
- [x] Feature showcases
- [x] Use cases
- [x] FAQ section
- [x] Routing

---

**Status**: ✅ All requested features implemented and working

**Dev Server**: Running at `http://localhost:5173/`
