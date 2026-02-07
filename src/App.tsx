import { useEffect, useState, useCallback } from 'react';
import './App.css';
import type { DocumentModel, DataRow } from './types';
import { DEFAULT_DOCUMENT_MODEL } from './constants';
import { processData } from './utils/dataProcessor';
import { exportPDF } from './utils/pdfExporter';
import {
  getWorkingDraft,
  saveWorkingDraft,
  getBaseImage,
  saveBaseImage,
  getQRLogo,
  saveQRLogo,
  clearAllStorage,
} from './utils/storage';

import { Preview } from './components/Preview';
import { PageSettings } from './components/PageSettings';
import { BaseImageSettings } from './components/BaseImageSettings';
import { DataInput } from './components/DataInput';
import { QRSettings } from './components/QRSettings';
import { LabelSettings } from './components/LabelSettings';
import { TemplateManager } from './components/TemplateManager';
import { Toast } from './components/Toast';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);
  const [doc, setDoc] = useState<DocumentModel>(DEFAULT_DOCUMENT_MODEL);
  const [baseImageBlob, setBaseImageBlob] = useState<Blob | undefined>();
  const [qrLogoBlob, setQrLogoBlob] = useState<Blob | undefined>();
  const [rows, setRows] = useState<DataRow[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        // Load all data sequentially
        const draft = await getWorkingDraft();
        const baseImage = await getBaseImage();
        const qrLogo = await getQRLogo();

        // Apply all state at once
        if (draft) {
          setDoc(draft);
        }
        if (baseImage) {
          setBaseImageBlob(baseImage);
        }
        if (qrLogo) {
          setQrLogoBlob(qrLogo);
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      } finally {
        // Mark as loaded even if there was an error
        setIsLoading(false);
        // Force preview to re-render after loading with a delay
        // to ensure all state updates and blob data is propagated
        setTimeout(() => {
          setRenderKey(prev => prev + 1);
        }, 200);
      }
    };

    loadSavedState();
  }, []);

  // Auto-save working draft (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveWorkingDraft(doc);
    }, 1000);

    return () => clearTimeout(timer);
  }, [doc]);

  // Process data whenever data config changes
  useEffect(() => {
    const processedRows = processData(doc.data);
    setRows(processedRows);
    
    // Reset page index if out of bounds
    if (currentPageIndex >= processedRows.length) {
      setCurrentPageIndex(Math.max(0, processedRows.length - 1));
    }
  }, [doc.data, currentPageIndex]);

  const handleDocChange = useCallback((updates: Partial<DocumentModel>) => {
    setDoc(prev => ({ ...prev, ...updates }));
  }, []);

  const handleBaseImageUpload = useCallback(async (file: File) => {
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    setBaseImageBlob(blob);
    await saveBaseImage(blob);
  }, []);

  const handleQRLogoUpload = useCallback(async (file: File) => {
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    setQrLogoBlob(blob);
    await saveQRLogo(blob);
  }, []);

  const handleQROffsetChange = useCallback((offsetX: number, offsetY: number) => {
    setDoc(prev => ({
      ...prev,
      qr: {
        ...prev.qr,
        offsetXPts: offsetX,
        offsetYPts: offsetY,
      },
    }));
  }, []);

  const handleLoadTemplate = useCallback(async (loadedDoc: DocumentModel, assets: any) => {
    setDoc(loadedDoc);
    
    if (assets.baseImageBlob) {
      setBaseImageBlob(assets.baseImageBlob);
      await saveBaseImage(assets.baseImageBlob);
    }
    
    if (assets.qrLogoBlob) {
      setQrLogoBlob(assets.qrLogoBlob);
      await saveQRLogo(assets.qrLogoBlob);
    }
  }, []);

  const handleExportPDF = async () => {
    if (rows.length === 0) {
      alert('No data to export. Please add URLs or upload CSV data.');
      return;
    }

    const validRows = rows.filter(r => r.errors.length === 0);
    if (validRows.length === 0) {
      alert('No valid rows to export. Please fix the errors in your data.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const pdfBytes = await exportPDF({
        doc,
        rows: validRows,
        baseImageBlob,
        qrLogoBlob,
        onProgress: (current, total) => {
          setExportProgress((current / total) * 100);
        },
      });

      // Download the PDF
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-cards-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({ message: `Successfully exported ${validRows.length} pages!`, type: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      setToast({ message: 'Failed to export PDF. Check console for details.', type: 'error' });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const currentRow = rows[currentPageIndex] || null;
  const validRows = rows.filter(r => r.errors.length === 0);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading...</h2>
          <p>Restoring your saved work...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Repeat Image with Different QR</h1>
        <div className="btn-group">
          <button
            className="btn btn-success"
            onClick={handleExportPDF}
            disabled={isExporting || validRows.length === 0}
          >
            {isExporting ? `Exporting... ${Math.round(exportProgress)}%` : `Export PDF (${validRows.length} pages)`}
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${exportProgress}%` }} />
        </div>
      )}

      <div className="app-main">
        <div className="sidebar">
          <div className="sidebar-content">
            <PageSettings doc={doc} onChange={handleDocChange} />
            
            <BaseImageSettings
              doc={doc}
              onChange={handleDocChange}
              onImageUpload={handleBaseImageUpload}
              hasImage={!!baseImageBlob}
            />
            
            <DataInput doc={doc} rows={rows} onChange={handleDocChange} />
            
            <QRSettings
              doc={doc}
              onChange={handleDocChange}
              onLogoUpload={handleQRLogoUpload}
              hasLogo={!!qrLogoBlob}
            />
            
            <LabelSettings doc={doc} onChange={handleDocChange} />
            
            <TemplateManager
              doc={doc}
              baseImageBlob={baseImageBlob}
              qrLogoBlob={qrLogoBlob}
              onLoadTemplate={handleLoadTemplate}
              onClearAllData={async () => {
                if (confirm('Are you sure you want to clear ALL saved data? This will delete all templates, settings, and uploaded images. This action cannot be undone.')) {
                  await clearAllStorage();
                  setDoc(DEFAULT_DOCUMENT_MODEL);
                  setBaseImageBlob(undefined);
                  setQrLogoBlob(undefined);
                  setRows([]);
                  setCurrentPageIndex(0);
                  alert('All data has been cleared. The page will now reload.');
                  window.location.reload();
                }
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {rows.length > 0 && (
            <div className="pagination" style={{ borderBottom: '1px solid #ddd', padding: '12px 20px', background: 'white' }}>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {currentPageIndex + 1} of {rows.length}
                {currentRow?.errors.length > 0 && (
                  <span style={{ color: '#e74c3c', marginLeft: '8px' }}>
                    (Has errors)
                  </span>
                )}
              </span>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => setCurrentPageIndex(prev => Math.min(rows.length - 1, prev + 1))}
                disabled={currentPageIndex >= rows.length - 1}
              >
                Next →
              </button>
            </div>
          )}
          
          <Preview
            key={renderKey}
            doc={doc}
            currentRow={currentRow}
            baseImageBlob={baseImageBlob}
            qrLogoBlob={qrLogoBlob}
            onQROffsetChange={handleQROffsetChange}
          />
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
