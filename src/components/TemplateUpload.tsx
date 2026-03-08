import type { DocumentModel } from '../types';
import { CollapsibleCard } from './CollapsibleCard';

interface TemplateUploadProps {
  doc: DocumentModel;
  onTemplateUpload: (file: File, pdfDimensions?: { widthPts: number; heightPts: number }) => void;
  hasTemplate: boolean;
}

export function TemplateUpload({ doc, onTemplateUpload, hasTemplate }: TemplateUploadProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's a PDF
      if (file.type === 'application/pdf') {
        try {
          // Import pdf-lib dynamically
          const { PDFDocument } = await import('pdf-lib');
          
          // Read the PDF file
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          
          // Validate: must be exactly 1 page
          const pageCount = pdfDoc.getPageCount();
          if (pageCount !== 1) {
            alert(`PDF must contain exactly one page. Your PDF has ${pageCount} pages.`);
            e.target.value = '';
            return;
          }
          
          // Extract dimensions from first page
          const page = pdfDoc.getPage(0);
          const { width, height } = page.getSize();
          
          // Validate dimensions are reasonable
          if (width < 72 || height < 72 || width > 14400 || height > 14400) {
            alert('PDF dimensions are out of acceptable range (must be between 72 and 14400 points).');
            e.target.value = '';
            return;
          }
          
          // Call the upload handler with PDF dimensions
          onTemplateUpload(file, { widthPts: width, heightPts: height });
        } catch (error) {
          console.error('PDF validation error:', error);
          alert('Invalid PDF file. Please upload a valid PDF document.');
          e.target.value = '';
          return;
        }
      } else {
        // It's an image, no dimension extraction needed
        onTemplateUpload(file);
      }
      
      // Clear the input value to allow re-selection of the same file
      e.target.value = '';
    }
  };

  return (
    <CollapsibleCard title="Upload Template" icon="📁" defaultExpanded={true}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Upload a template image or PDF that will appear on every page as the background.
      </p>
      
      <div className="form-group">
        <label>Upload Template (Image or PDF)</label>
        <input
          type="file"
          className="form-control"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          onChange={handleFileUpload}
        />
        {hasTemplate && (
          <div style={{ fontSize: '11px', color: '#27ae60', marginTop: '4px' }}>
            ✓ {doc.baseImage.sourceType === 'pdf' ? 'PDF' : 'Image'} is loaded (file input can't show saved files)
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}
