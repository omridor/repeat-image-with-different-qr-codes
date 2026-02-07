import { useEffect, useRef, useState } from 'react';
import type { DocumentModel, DataRow } from '../types';
import { renderPreview } from '../utils/canvasRenderer';
import './Preview.css';

interface PreviewProps {
  doc: DocumentModel;
  currentRow: DataRow | null;
  baseImageBlob?: Blob;
  qrLogoBlob?: Blob;
  onQROffsetChange?: (offsetX: number, offsetY: number) => void;
}

export function Preview({ doc, currentRow, baseImageBlob, qrLogoBlob, onQROffsetChange }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tempOffset, setTempOffset] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRenderingRef = useRef(false);
  const renderCounterRef = useRef(0);

  const scale = 4; // Rendering scale for better quality (higher = sharper)

  useEffect(() => {
    if (!canvasRef.current) return;
    // Allow rendering even without currentRow if there's a base image to show
    if (!currentRow && !baseImageBlob) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear any pending render timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Debounce rapid changes (like paste) - only render after 50ms of no changes
    renderTimeoutRef.current = setTimeout(() => {
      // Increment render counter to track this render
      renderCounterRef.current += 1;

      // Use temp offset if dragging
      const docToRender = isDragging && tempOffset 
        ? { ...doc, qr: { ...doc.qr, offsetXPts: tempOffset.x, offsetYPts: tempOffset.y } }
        : doc;

      isRenderingRef.current = true;
      
      renderPreview({
        canvas: canvasRef.current!,
        ctx,
        doc: docToRender,
        row: currentRow,
        baseImageBlob,
        qrLogoBlob,
        scale,
      }).catch(err => {
        console.error('Failed to render preview:', err);
      }).finally(() => {
        isRenderingRef.current = false;
      });
    }, 50); // 50ms debounce

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [doc, currentRow, baseImageBlob, qrLogoBlob, isDragging, tempOffset, scale]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    // Account for zoom by dividing by zoom since canvas is scaled via transform
    const x = ((e.clientX - rect.left) / (rect.width / doc.page.widthPts));
    const y = ((e.clientY - rect.top) / (rect.height / doc.page.heightPts));
    
    return { x, y };
  };
  
  const getCanvasAnchorPoint = (doc: DocumentModel): { x: number; y: number } => {
    const canvasWidth = doc.page.widthPts;
    const canvasHeight = doc.page.heightPts;
    
    switch (doc.qr.canvasAnchor) {
      case 'tl':
        return { x: 0, y: 0 };
      case 'tr':
        return { x: canvasWidth, y: 0 };
      case 'bl':
        return { x: 0, y: canvasHeight };
      case 'br':
        return { x: canvasWidth, y: canvasHeight };
      case 'center':
        return { x: canvasWidth / 2, y: canvasHeight / 2 };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onQROffsetChange) return;

    const { x, y } = getCanvasCoordinates(e);
    
    // Calculate current QR position to check if we're clicking on it
    const canvasAnchor = getCanvasAnchorPoint(doc);
    const qrCenterX = canvasAnchor.x + doc.qr.offsetXPts;
    const qrCenterY = canvasAnchor.y + doc.qr.offsetYPts;
    
    const qrSize = doc.qr.sizePts;
    const distance = Math.sqrt(Math.pow(x - qrCenterX, 2) + Math.pow(y - qrCenterY, 2));
    
    if (distance < qrSize) {
      setIsDragging(true);
      setDragStart({ x, y });
      setTempOffset({ x: doc.qr.offsetXPts, y: doc.qr.offsetYPts });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !onQROffsetChange) return;

    const { x, y } = getCanvasCoordinates(e);

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    const newOffsetX = doc.qr.offsetXPts + deltaX;
    const newOffsetY = doc.qr.offsetYPts + deltaY;

    // Update temp offset for immediate visual feedback
    setTempOffset({ x: newOffsetX, y: newOffsetY });
    setDragStart({ x, y });

    // Debounce the actual state update
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    renderTimeoutRef.current = setTimeout(() => {
      onQROffsetChange(newOffsetX, newOffsetY);
    }, 50);
  };

  const handleMouseUp = () => {
    if (isDragging && tempOffset && onQROffsetChange) {
      // Final update on mouse up
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      onQROffsetChange(tempOffset.x, tempOffset.y);
    }
    setIsDragging(false);
    setTempOffset(null);
  };

  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleZoomReset = () => setZoom(1);
  const handleZoomFit = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40;
      const containerHeight = containerRef.current.clientHeight - 140;
      const scaleX = containerWidth / doc.page.widthPts;
      const scaleY = containerHeight / doc.page.heightPts;
      setZoom(Math.min(scaleX, scaleY, 2));
    }
  };
  
  const handleRefresh = () => {
    renderCounterRef.current += 1;
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    // Force immediate re-render
    const ctx = canvasRef.current?.getContext('2d');
    if (canvasRef.current && ctx && (currentRow || baseImageBlob)) {
      const docToRender = isDragging && tempOffset 
        ? { ...doc, qr: { ...doc.qr, offsetXPts: tempOffset.x, offsetYPts: tempOffset.y } }
        : doc;
      
      isRenderingRef.current = true;
      renderPreview({
        canvas: canvasRef.current,
        ctx,
        doc: docToRender,
        row: currentRow,
        baseImageBlob,
        qrLogoBlob,
        scale,
      }).catch(err => {
        console.error('Failed to render preview:', err);
      }).finally(() => {
        isRenderingRef.current = false;
      });
    }
  };

  if (!currentRow && !baseImageBlob) {
    return (
      <div className="preview-area">
        <div className="preview-empty">
          <p>No data to preview</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Add URLs or upload CSV data to see preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-area" ref={containerRef}>
      {/* Zoom Controls */}
      <div className="preview-controls">
        <div className="zoom-controls">
          <button className="btn btn-small btn-secondary" onClick={handleRefresh} title="Refresh Preview">
            🔄 Refresh
          </button>
          <button className="btn btn-small btn-secondary" onClick={handleZoomOut} title="Zoom Out">
            −
          </button>
          <span className="zoom-display">{Math.round(zoom * 100)}%</span>
          <button className="btn btn-small btn-secondary" onClick={handleZoomIn} title="Zoom In">
            +
          </button>
          <button className="btn btn-small btn-secondary" onClick={handleZoomReset} title="Reset Zoom">
            100%
          </button>
          <button className="btn btn-small btn-secondary" onClick={handleZoomFit} title="Fit to Window">
            Fit
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="preview-canvas-container">
        <div 
          className="preview-canvas-wrapper"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <canvas
            ref={canvasRef}
            className="preview-canvas"
            style={{
              width: `${doc.page.widthPts}px`,
              height: `${doc.page.heightPts}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

    </div>
  );
}
