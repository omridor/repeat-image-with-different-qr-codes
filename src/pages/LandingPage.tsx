import { Link } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <h1>Repeat Image with Different QR Codes</h1>
          <p className="tagline">
            Create Multi-Page PDFs with Unique QR Codes for Labels, Tickets, Badges & More
          </p>
          <Link to="/tool" className="cta-button">
            Start Creating Free →
          </Link>
          <p className="subtitle">No signup required • 100% free • Runs in your browser</p>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Use This Tool?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>One Template, Many QR Codes</h3>
              <p>
                Upload a single template image and automatically generate hundreds of variations,
                each with a unique QR code. Perfect for event tickets, product labels, or name badges.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Multi-Page PDF Export</h3>
              <p>
                Export all your designs as a single PDF file, ready for professional printing.
                Each page contains your template with a different QR code and optional label text.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>100% Private & Secure</h3>
              <p>
                Everything runs locally in your browser. No data is uploaded to any server.
                Your templates, images, and QR code data never leave your computer.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Easy to Use</h3>
              <p>
                Intuitive interface with drag-and-drop positioning. See your changes in real-time
                with WYSIWYG preview. No learning curve required.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Precise Control</h3>
              <p>
                Fine-tune every aspect: QR code size, position, rotation, colors, and styling.
                Add custom labels with multiple fonts, colors, backgrounds, and text wrapping.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Save Templates</h3>
              <p>
                Save your configurations as templates for reuse. Export and share templates
                with team members. Never start from scratch again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases">
        <div className="container">
          <h2>Perfect For</h2>
          <div className="use-case-grid">
            <div className="use-case">
              <h3>🏷️ Product Labels</h3>
              <p>Generate unique labels for inventory tracking, product authentication, or promotional campaigns.</p>
            </div>
            <div className="use-case">
              <h3>🎟️ Event Tickets</h3>
              <p>Create scannable tickets with unique QR codes for entry validation and attendee tracking.</p>
            </div>
            <div className="use-case">
              <h3>👔 Name Badges</h3>
              <p>Design conference badges or employee ID cards with QR codes for quick check-in.</p>
            </div>
            <div className="use-case">
              <h3>🍷 Wine & Bottle Labels</h3>
              <p>Add QR codes to bottle labels linking to product information, recipes, or tasting notes.</p>
            </div>
            <div className="use-case">
              <h3>🎁 Gift Tags</h3>
              <p>Create personalized gift tags with QR codes linking to videos, messages, or photo albums.</p>
            </div>
            <div className="use-case">
              <h3>📦 Luggage Tags</h3>
              <p>Make smart luggage tags with QR codes containing contact information for lost luggage.</p>
            </div>
            <div className="use-case">
              <h3>📚 Marketing Materials</h3>
              <p>Add trackable QR codes to flyers, postcards, or promotional cards for campaign analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Your Template</h3>
              <p>
                Start by uploading your base image (logo, artwork, or design) that will appear
                on every page. Supports PNG and JPEG formats.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Your Data</h3>
              <p>
                Paste a list of URLs or upload a CSV file with your QR code destinations.
                Each row creates a new page with a unique QR code.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Customize</h3>
              <p>
                Position your QR code with drag-and-drop. Adjust size, colors, rotation, and styling.
                Add optional labels with custom text and formatting.
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Export PDF</h3>
              <p>
                Click "Export PDF" to generate your multi-page document. Download and send
                directly to your printer or print service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="features-list">
        <div className="container">
          <h2>Comprehensive Features</h2>
          <div className="two-column-list">
            <div className="column">
              <h3>📐 Page Setup</h3>
              <ul>
                <li>30+ preset sizes (labels, tickets, badges, tags)</li>
                <li>Custom dimensions with multiple units (cm, inches, mm)</li>
                <li>Bleed and safe margin controls</li>
                <li>Visual overlay guides with legend</li>
              </ul>

              <h3>🎨 QR Code Styling</h3>
              <ul>
                <li>Pattern styles: square, dots, rounded, extra-rounded, classy, classy-rounded</li>
                <li>Custom foreground and background colors</li>
                <li>Transparent backgrounds</li>
                <li>Embed logos inside QR codes</li>
                <li>4 error correction levels (L, M, Q, H)</li>
                <li>Adjustable quiet zone</li>
              </ul>

              <h3>📝 Label Controls</h3>
              <ul>
                <li>Multiple font families (Helvetica, Times, Courier)</li>
                <li>Custom text size, weight, and color</li>
                <li>Background boxes with rounded corners</li>
                <li>Text outlines for visibility</li>
                <li>Smart text wrapping with ellipsis</li>
                <li>4 orientation options (top, bottom, left, right)</li>
              </ul>
            </div>
            <div className="column">
              <h3>🖼️ Image Placement</h3>
              <ul>
                <li>Multiple fit modes (contain, cover, stretch, fill)</li>
                <li>90° rotation intervals</li>
                <li>Lock aspect ratio option</li>
                <li>Precise X/Y offset controls</li>
                <li>Placement bounds: bleed area, canvas, or safe area</li>
                <li>Extra padding controls</li>
              </ul>

              <h3>📊 Data Input</h3>
              <ul>
                <li>Paste URLs directly (one per line)</li>
                <li>Upload or paste CSV data</li>
                <li>Automatic header detection</li>
                <li>Column mapping for payload and labels</li>
                <li>Label templates with variables</li>
                <li>URL-based label derivation</li>
                <li>Per-row validation with error reporting</li>
              </ul>

              <h3>💾 Templates & Export</h3>
              <ul>
                <li>Save unlimited templates locally</li>
                <li>Export/import templates as JSON</li>
                <li>Auto-save working drafts</li>
                <li>Multi-page PDF generation</li>
                <li>Progress tracking during export</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Is this tool really free?</h3>
              <p>
                Yes! 100% free with no hidden costs, subscriptions, or limitations. All features
                are available to everyone without requiring an account or payment.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do I need to install anything?</h3>
              <p>
                No installation required. This is a web-based tool that runs entirely in your browser.
                Simply visit the website and start creating immediately.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is my data secure?</h3>
              <p>
                Absolutely. Everything runs locally in your browser. No data is uploaded to any server.
                Your images, QR codes, and data never leave your computer. It's completely private and secure.
              </p>
            </div>
            <div className="faq-item">
              <h3>What image formats are supported?</h3>
              <p>
                You can upload PNG and JPEG images as your template. The tool also supports PNG and JPEG
                for QR code logos. PDFs are exported in standard PDF format compatible with all printers.
              </p>
            </div>
            <div className="faq-item">
              <h3>How many QR codes can I generate at once?</h3>
              <p>
                There's no strict limit. You can generate hundreds of QR codes in a single PDF.
                For very large batches (500+), the export process may take a few minutes depending on your computer's speed.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I use this for commercial purposes?</h3>
              <p>
                Yes! You're free to use this tool for both personal and commercial projects.
                Generate QR codes for your business, clients, or products without any restrictions.
              </p>
            </div>
            <div className="faq-item">
              <h3>What CSV format should I use?</h3>
              <p>
                Use a simple CSV file with headers. The most basic format is two columns: "url" and "label".
                You can include additional columns for use in label templates. See the tool's help section for examples.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I save my templates?</h3>
              <p>
                Yes! You can save unlimited templates in your browser's local storage. You can also export
                templates as JSON files to back them up or share with team members.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does this work offline?</h3>
              <p>
                After your first visit, the tool caches in your browser and can work offline (depending on your browser).
                Since everything runs locally, you don't need an internet connection to generate PDFs after the initial load.
              </p>
            </div>
            <div className="faq-item">
              <h3>What browsers are supported?</h3>
              <p>
                Works in all modern browsers: Chrome, Firefox, Safari, and Edge. For the best experience,
                we recommend using the latest version of your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Create Your QR Code PDFs?</h2>
          <p>Start generating professional QR code documents in seconds</p>
          <Link to="/tool" className="cta-button large">
            Launch Tool Now →
          </Link>
          <p className="cta-subtitle">No signup • No credit card • No installation</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>
            <strong>Repeat Image with Different QR Codes</strong> - Free Bulk QR Code Generator
          </p>
          <p className="footer-note">
            Create multi-page PDFs with unique QR codes for labels, tickets, badges, and more.
            100% free and open source. All processing happens in your browser - your data stays private.
          </p>
          <p className="copyright">
            Built with React, TypeScript, pdf-lib, and qr-code-styling
          </p>
        </div>
      </footer>
    </div>
  );
}
