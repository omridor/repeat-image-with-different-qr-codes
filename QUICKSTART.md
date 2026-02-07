# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Start the Application

The development server is already running at:
```
http://localhost:5173/
```

Open this URL in your browser.

### 2. Basic Workflow

#### Step 1: Configure Page Size
1. In the sidebar, find **"Page Settings"**
2. Choose a preset (e.g., "Business card (US)")
3. Select your preferred units (cm, in, or mm)

#### Step 2: Upload Base Image (Optional)
1. Find **"Base Image"** section
2. Click "Upload Template Image"
3. Select a PNG or JPEG file
4. Adjust fit mode if needed

#### Step 3: Add Data
1. Find **"Data Input"** section
2. Choose between two modes:

**Option A: URL List**
```
https://example.com/product/001
https://example.com/product/002
https://example.com/product/003
```

**Option B: CSV**
- Upload the included `sample-data.csv` file, or
- Paste CSV text directly:
```csv
url,label
https://example.com/1,Item 1
https://example.com/2,Item 2
```

#### Step 4: Customize QR Code
1. Find **"QR Code Settings"** section
2. Adjust size (default is good for business cards)
3. Choose colors
4. Upload a logo (optional)

#### Step 5: Configure Label
1. Find **"Label Settings"** section
2. Ensure "Show labels" is checked
3. Choose font and size
4. Adjust position/orientation as needed

#### Step 6: Preview & Position
1. Look at the center preview canvas
2. **Drag the QR code** to position it perfectly
3. Use Previous/Next buttons to preview all pages

#### Step 7: Export PDF
1. Click the green **"Export PDF"** button in the header
2. Wait for generation (progress bar shows status)
3. PDF downloads automatically

## 📝 Sample Data

Use the included `sample-data.csv` file for quick testing:
- 10 sample URLs
- Labels already provided
- Extra column for template variables

## 🎨 Quick Tips

### Perfect Business Card Layout
1. Preset: Business card (US)
2. QR Size: ~2.5cm
3. Position: Center or bottom-right
4. Label: Bottom orientation, 8pt gap
5. Font: Helvetica, 8-10pt

### Professional Labels
1. Enable background box
2. Set padding to 4-6pt
3. Add border radius for rounded corners
4. Use outline for visibility on busy backgrounds

### High-Density QR Codes
1. Use Error Correction: H (30%)
2. Increase QR size
3. Test scanability before mass printing

### Logo in QR Code
1. Upload logo (square works best)
2. Keep size at 20-25%
3. Enable backing for better scanability
4. Use High error correction (H)

## 💾 Save Your Work

### Create a Template
1. Click **"Templates"** section to expand
2. Click **"New"** button
3. Enter a name
4. Click "Create"

Your template now includes:
- All settings
- Base image
- QR logo
- Everything except CSV data

### Load a Template
1. Expand **"Templates"** section
2. Click on any saved template
3. All settings load instantly

### Export/Import Templates
- **Export**: Click ⬇ button next to template
- **Import**: Use "Import Template" file picker
- Share templates with colleagues!

## 🐛 Troubleshooting

### QR Code Not Showing
- Make sure you've added data (URLs or CSV)
- Check that payload column is selected in CSV mode
- Look for validation errors (red highlighting)

### PDF Export Fails
- Check browser console for errors
- Ensure all data rows are valid
- Try with fewer pages first (test with 10 rows)

### Preview Looks Wrong
- Toggle "Show overlays" to see margins
- Check "Clip to trim area" setting
- Verify base image fit mode

### Can't Drag QR Code
- Make sure preview is visible
- Try clicking directly on the QR code area
- Position values update as you drag

## 🎯 Common Workflows

### Product Inventory Labels
1. Prepare CSV with: url, product_id, product_name
2. Use label template: `{col:product_id}\n{col:product_name}`
3. Set QR to top-left, label below
4. Export PDF, print on label sheets

### Event Name Badges
1. Upload company logo as base image
2. CSV with: url (profile), name, title
3. Label template: `{col:name}\n{col:title}`
4. Large QR centered at bottom
5. Export and print on badge stock

### Marketing Cards
1. Upload marketing artwork as base
2. Single QR code for campaign URL
3. Small text label or no label
4. Position QR in corner
5. Print double-sided cards

## 📚 Next Steps

- Read [FEATURES.md](FEATURES.md) for complete feature list
- Check [README.md](README.md) for detailed documentation
- Experiment with different settings
- Save templates for reuse

## 🔒 Privacy Note

Everything happens locally in your browser:
- No data uploaded to servers
- No tracking or analytics
- Your data stays on your device
- Safe to use with confidential information

---

**Need Help?** Check the browser console (F12) for error messages.

**Found a Bug?** Note the steps to reproduce and check console logs.

**Want More Features?** See potential enhancements in FEATURES.md.
