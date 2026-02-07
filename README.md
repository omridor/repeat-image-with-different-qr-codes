# Repeat Image with Different QR Codes

🚀 **[Try it Live](https://www.repeat-image-with-different-qr.codes/)** 

A free, client-side web tool that generates multi-page PDFs with unique QR codes. Upload a single template image and automatically create hundreds of variations, each with a different QR code and optional label text.

## 🌟 Perfect For

- **Product Labels** - Unique labels for inventory tracking
- **Event Tickets** - Scannable tickets with validation codes
- **Name Badges** - Conference or employee badges
- **Labels, Tickets, Badges & More** - Any use case requiring batch QR code generation
- **Wine/Bottle Labels** - QR codes linking to product information
- **Gift Tags** - Personalized tags with QR codes
- **Marketing Materials** - Trackable promotional cards

## ✨ Key Features

### 🎨 One Template, Many QR Codes
Upload a single template image and generate hundreds of variations, each with a unique QR code.

### 📄 Multi-Page PDF Export
Export all designs as a single PDF file, ready for professional printing.

### 🔒 100% Private & Secure
Everything runs locally in your browser. No data is uploaded to any server. Your templates and data never leave your computer.

### 🎯 Comprehensive Controls

**30+ Size Presets:**
- Business cards (US, EU, Square)
- Labels (Square, Rectangle, Avery formats)
- Name badges
- Playing cards (Poker, Bridge, Tarot)
- Gift tags
- Postcards
- Event tickets
- Bookmarks
- Luggage tags
- Wine/bottle labels
- CD/DVD labels
- Custom sizes

**QR Code Styling:**
- Pattern styles: squares, dots, rounded
- Custom colors (foreground, background, transparent)
- Embed logos inside QR codes
- 4 error correction levels (L, M, Q, H)
- Adjustable quiet zone
- 90° rotation intervals

**Label Controls:**
- Multiple fonts (Helvetica, Times Roman, Courier)
- Custom size, weight, and color
- Background boxes with rounded corners
- Text outlines for visibility
- Smart text wrapping with ellipsis
- 4 orientations (top, bottom, left, right)

**Image Placement:**
- Multiple fit modes (contain, cover, stretch, fill-width, fill-height)
- 90° rotation intervals
- Lock aspect ratio
- Precise X/Y offset controls
- Placement bounds: bleed area, canvas, or safe area
- Extra padding controls

**Data Input:**
- Paste URLs directly (one per line)
- Upload or paste CSV data
- Automatic header detection
- Column mapping for payload and labels
- Label templates with variables: `{index}`, `{id}`, `{col:Name}`
- URL-based label derivation
- Per-row validation

**Templates:**
- Save unlimited templates locally
- Export/import templates as JSON
- Auto-save working drafts
- Share templates with team members

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173/`

### Build

```bash
npm run build
```

## 📖 How to Use

1. **Visit the Landing Page** - Learn about features and use cases
2. **Click "Start Creating"** - Launch the tool
3. **Upload Template** - Add your base image (logo, artwork, design)
4. **Add Data** - Paste URLs or upload CSV with QR destinations
5. **Customize** - Position QR code, adjust styling, add labels
6. **Export PDF** - Generate multi-page document ready for printing

## 🎓 Example Workflows

### Business Cards with vCard QR Codes
1. Upload business card template
2. Paste list of vCard URLs (one per employee)
3. Add labels with employee names using CSV `{col:name}` variable
4. Export PDF with 50 unique business cards

### Product Labels
1. Upload product label design
2. Upload CSV with product URLs and SKUs
3. Use label template: `SKU: {col:sku}`
4. Position QR code and export

### Event Tickets
1. Upload ticket template
2. Generate unique ticket URLs (with validation codes)
3. Add ticket numbers as labels
4. Export PDF for batch printing

## 🛠️ Tech Stack

- **Vite** + **React 18** + **TypeScript** - Modern, fast development
- **pdf-lib** - PDF generation
- **qr-code-styling** - Advanced QR codes with styling
- **idb-keyval** - IndexedDB persistence
- **papaparse** - CSV parsing
- **react-router-dom** - Routing

## 📐 Margin System Explained

### Bleed Area
Extra area outside the canvas that extends beyond where the final cut will be made. Design elements can extend into this area to prevent white edges after cutting.

### Canvas/Trim Line
The actual size of the final product after cutting. This is where the cut will be made.

### Safe Area
The inner zone where all critical content (text, logos, QR codes) should be placed to ensure nothing important gets cut off during trimming.

### Visual Guide
When "Show overlay guides & legend" is enabled, you'll see:
- 🔴 Red dashed line: Trim/Canvas boundary
- 🔵 Blue dashed line: Safe area
- 🟢 Green solid line: Image boundary
- Legend with explanations

## 🔐 Privacy & Security

- **No backend server** - All processing happens in your browser
- **No data uploads** - Everything stays on your device
- **No tracking** - No analytics or external calls
- **Offline capable** - Works without internet after initial load
- **Open source** - Transparent code you can inspect

## 📱 Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## 💡 Tips

- Use **High error correction (H)** when embedding logos in QR codes
- Keep QR codes **inside the safe area** for guaranteed scanability
- Test QR code scanning before printing large batches
- Save templates for frequently used configurations
- Use CSV mode for variable data with custom label templates

## 📝 CSV Format

Basic format:
```csv
url,label
https://example.com/product/001,Product 001
https://example.com/product/002,Product 002
```

Advanced format with label template:
```csv
url,sku,name,price
https://example.com/1,ABC-001,Widget A,$19.99
https://example.com/2,ABC-002,Widget B,$24.99
```

Then use label template: `{col:sku} - {col:name}`

## 🤝 Contributing

Contributions welcome! This is a community project.

## 📄 License

ISC

---

**Built with ❤️ for designers, marketers, and creators who need bulk QR code generation**
