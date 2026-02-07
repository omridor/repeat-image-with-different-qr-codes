# QR PDF Card Maker - Feature Details

## Complete Feature List

### ✅ Core Features (All Implemented)

#### 1. **Client-Side Only Architecture**
- No backend server required
- No data uploaded to external services
- 100% local processing
- Works offline after initial load

#### 2. **Persistent Storage**
- Settings saved in IndexedDB
- Templates stored locally
- Uploaded assets (images, logos) persisted
- Auto-save working draft (debounced)
- Last selected template remembered

#### 3. **WYSIWYG Preview**
- Real-time canvas preview
- Drag-and-drop QR code positioning
- Visual bleed and safe margin overlays
- Checkerboard pattern outside trim area
- Live updates as settings change
- Page navigation for multi-page preview

#### 4. **Unit Conversion System**
- Support for cm, inches, and mm
- Internal storage in PDF points
- Automatic conversion between units
- User preference persisted

#### 5. **Page Settings**
- **Presets:**
  - Business card (US): 3.5" × 2"
  - Business card (EU): 85mm × 55mm
  - Playing card (poker): 2.5" × 3.5"
  - Custom size
- **Margins:**
  - Bleed margins (linked/unlinked)
  - Safe margins (linked/unlinked)
  - Default: 0.3cm bleed, 0.5cm safe
- **Overlays:**
  - Toggle bleed/safe overlays
  - Clip to trim area option

#### 6. **Base Image Management**
- Upload template image (PNG, JPEG)
- Fit modes: contain, cover, stretch
- 0-360° rotation slider
- Extra padding controls (top, right, bottom, left)
- Image persisted in IndexedDB

#### 7. **Data Input - Two Modes**

**URL List Mode:**
- Paste URLs, one per line
- Auto-derive labels from URLs
- Derive methods:
  - Last path segment
  - Custom regex pattern
- Label template variables

**CSV Mode:**
- Upload CSV file or paste text
- Auto-detect headers
- Choose payload column (default: 'url')
- Choose label column (default: 'label')
- Preview first 10 rows
- Validation with error highlighting
- Row count display

#### 8. **Label Template Variables**
- `{index}`: 1-based row number
- `{id}`: Derived ID from URL
- `{short}`: Short ID
- `{col:HeaderName}`: Any CSV column value

#### 9. **QR Code Configuration**
- **Positioning:**
  - Drag-and-drop on canvas
  - Numeric X/Y coordinates
  - 5 anchor points: TL, TR, BL, BR, Center
  - Snap to safe margin option
- **Size:**
  - Adjustable in any unit
- **Group Rotation:**
  - 0-360° slider
  - Applies to QR + label (optional)
- **Pattern Styles:**
  - Squares
  - Dots
  - Rounded
- **Corner Styles:**
  - Square
  - Rounded
- **Error Correction Levels:**
  - L (Low - 7%)
  - M (Medium - 15%)
  - Q (Quartile - 25%)
  - H (High - 30%)
- **Colors:**
  - Foreground color picker
  - Background color picker
  - Transparent background option
  - Color input with hex value
- **Quiet Zone:**
  - Adjustable padding around QR code

#### 10. **QR Logo Embedding**
- Upload logo image (PNG, JPEG)
- Enable/disable toggle
- Logo size: 5-50% of QR size
- Optional backing:
  - Background color
  - Border radius
- High compatibility with error correction

#### 11. **Label Settings**
- **Enable/Disable Toggle**
- **Orientation:**
  - Bottom (under QR)
  - Top (above QR)
  - Left (left of QR)
  - Right (right of QR)
- **Position Controls:**
  - Gap from QR code
  - X/Y offset fine-tuning
- **Text Box Width:**
  - Auto (matches QR width)
  - Custom width
- **Alignment:**
  - Start (left/top)
  - Center
  - End (right/bottom)
- **Rotate with Group:**
  - Follow QR rotation or stay horizontal

#### 12. **Font Controls**
- **Font Family:**
  - Helvetica
  - Times Roman
  - Courier
  - Custom font upload (future)
- **Size:** Adjustable in points
- **Weight:**
  - Regular
  - Bold
- **Color:** Color picker with hex input
- **Line Height:** 0.8-3.0 multiplier
- **Letter Spacing:** Adjustable in points

#### 13. **Label Background Box**
- Enable/disable toggle
- Background color picker
- Padding control
- Border radius (rounded corners)

#### 14. **Text Outline**
- Enable/disable toggle
- Outline color picker
- Outline width in points
- Great for visibility on busy backgrounds

#### 15. **Text Wrapping**
- **Wrap Mode:**
  - Word wrap
  - Character wrap
  - No wrap
- **Max Lines:** 1-10
- **Ellipsis:** Auto-truncate with "..."

#### 16. **PDF Export**
- Multi-page PDF generation
- One page per data row
- Progress indicator
- Skip rows with validation errors
- Automatic download
- Filename with timestamp
- High-quality rendering

#### 17. **Template Management**
- **Save Templates:**
  - New template
  - Save changes to existing
  - Save as (duplicate)
- **Template Storage:**
  - Document model
  - All settings
  - Base image
  - QR logo
  - Optional: CSV data
- **Template Operations:**
  - List all templates
  - Load template
  - Delete template
  - Export template (JSON)
  - Import template (JSON)
- **Template Metadata:**
  - Name
  - Created date
  - Updated date
  - Optional notes
  - Thumbnail (future)

#### 18. **Data Validation**
- URL format validation
- HTTP/HTTPS scheme check
- Optional non-HTTP schemes
- Per-row error reporting
- Visual error indicators
- Error count summary

#### 19. **Preview Navigation**
- Page-by-page preview
- Previous/Next buttons
- Page counter (X of Y)
- Error indicator per page
- Keyboard navigation ready

#### 20. **Responsive UI**
- Collapsible template panel
- Scrollable sidebar
- Fixed header
- Pagination controls
- Clean, modern design
- Intuitive controls

## Technical Implementation Details

### Canvas Rendering
- 2× scale for high DPI displays
- Efficient drawing pipeline
- Layer order: background → base image → QR → label → overlays

### PDF Generation
- Uses pdf-lib for PDF creation
- Coordinate system conversion (canvas ↔ PDF)
- Image embedding (PNG, JPEG)
- Font embedding (standard fonts)
- Rotation and transformations

### QR Code Generation
- Uses qr-code-styling library
- Supports advanced styling
- Logo embedding with error correction
- PNG output format
- Canvas and blob generation

### Storage Architecture
- IndexedDB via idb-keyval
- Template index for fast listing
- Individual template bundles
- Working draft auto-save
- Asset blob storage

### Performance Optimizations
- Debounced auto-save (1 second)
- Efficient re-renders with React hooks
- Canvas reuse
- Lazy loading of templates
- Minimal re-processing

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Any modern browser with ES2020 support

## Limitations & Future Enhancements

### Current Limitations
1. Custom font upload not implemented (structure ready)
2. Template thumbnails not generated
3. No batch QR editing
4. No undo/redo
5. No print preview

### Potential Enhancements
1. PWA with service worker for full offline
2. Template sharing via URL
3. Batch operations
4. More page presets
5. Image filters/adjustments
6. Multiple QR codes per page
7. Variable data printing
8. Barcode support (in addition to QR)
9. SVG export
10. Print-ready PDF with crop marks

## Use Cases

1. **Product Labels**: Generate QR codes for product inventory
2. **Event Badges**: Create name badges with QR codes
3. **Business Cards**: Modern business cards with QR contact info
4. **Gift Tags**: Personalized tags with QR codes
5. **Asset Tracking**: Labels for equipment/inventory
6. **Marketing**: Promotional cards with QR links
7. **Educational**: Flashcards with QR codes to resources
8. **Ticketing**: Event tickets with unique QR codes
9. **Certificates**: Certificates with verification QR codes
10. **Wine Labels**: Custom wine bottle labels

## Security & Privacy

- **No data leaves your browser**
- **No analytics or tracking**
- **No external API calls** (after initial app load)
- **Data stored locally only**
- **You control all data**
- **Export/delete anytime**

## Data Size Considerations

- IndexedDB typically supports 50MB+ per origin
- Base images: Recommended < 5MB
- QR logos: Recommended < 1MB
- Templates: Typically < 10MB each
- Large PDFs (100+ pages) may take 30-60 seconds to generate
