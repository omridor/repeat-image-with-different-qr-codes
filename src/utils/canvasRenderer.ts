import type { DocumentModel, DataRow, Anchor } from '../types';
import { generateQRCodeCanvas } from './qrGenerator';

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  doc: DocumentModel;
  row: DataRow | null;
  baseImageBlob?: Blob;
  qrLogoBlob?: Blob;
  scale: number;
}

export async function renderPreview(context: RenderContext): Promise<void> {
  const { canvas, ctx, doc, row, baseImageBlob, qrLogoBlob, scale } = context;
  
  // Clear any previous transforms
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Set canvas size to match page
  canvas.width = doc.page.widthPts * scale;
  canvas.height = doc.page.heightPts * scale;
  
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Scale context
  ctx.save();
  ctx.scale(scale, scale);
  
  // Draw checkerboard background
  drawCheckerboard(ctx, doc);
  
  // Draw base image
  if (baseImageBlob) {
    try {
      await drawBaseImage(ctx, doc, baseImageBlob);
    } catch (error) {
      console.error('Failed to render base image:', error);
    }
  }
  
  // Draw QR code (only if we have data)
  if (row) {
    try {
      const qrCanvas = await generateQRCodeCanvas(row.payload, doc.qr, qrLogoBlob, scale);
      drawQRCode(ctx, doc, qrCanvas, qrLogoBlob);
    } catch (error) {
      console.error('Failed to render QR code:', error);
    }
    
    // Draw label
    if (doc.label.enabled && row.label) {
      drawLabel(ctx, doc, row.label);
    }
  }
  
  // Draw overlays (bleed and safe margins)
  if (doc.overlays.show) {
    drawOverlays(ctx, doc);
  }
  
  ctx.restore();
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, doc: DocumentModel): void {
  const checkSize = 10;
  
  // Draw checkerboard everywhere
  for (let x = 0; x < doc.page.widthPts; x += checkSize) {
    for (let y = 0; y < doc.page.heightPts; y += checkSize) {
      const isEven = (Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0;
      ctx.fillStyle = isEven ? '#e0e0e0' : '#ffffff';
      ctx.fillRect(x, y, checkSize, checkSize);
    }
  }
}

async function drawBaseImage(
  ctx: CanvasRenderingContext2D,
  doc: DocumentModel,
  blob: Blob
): Promise<{ x: number; y: number; width: number; height: number }> {
  const img = await createImageBitmap(blob);
  
  // Calculate bounds based on placementBounds setting
  let boundsX = 0;
  let boundsY = 0;
  let boundsWidth = doc.page.widthPts;
  let boundsHeight = doc.page.heightPts;
  
  if (doc.baseImage.placementBounds === 'canvas') {
    // Trim area (inside bleed)
    boundsX = doc.bleed.leftPts;
    boundsY = doc.bleed.topPts;
    boundsWidth = doc.page.widthPts - doc.bleed.leftPts - doc.bleed.rightPts;
    boundsHeight = doc.page.heightPts - doc.bleed.topPts - doc.bleed.bottomPts;
  } else if (doc.baseImage.placementBounds === 'safe-area') {
    // Safe area (inside bleed and safe margins)
    boundsX = doc.bleed.leftPts + doc.safe.leftPts;
    boundsY = doc.bleed.topPts + doc.safe.topPts;
    boundsWidth = doc.page.widthPts - doc.bleed.leftPts - doc.bleed.rightPts - doc.safe.leftPts - doc.safe.rightPts;
    boundsHeight = doc.page.heightPts - doc.bleed.topPts - doc.bleed.bottomPts - doc.safe.topPts - doc.safe.bottomPts;
  }
  // For 'bleed-area', use full page (default values)
  
  // Apply extra padding
  const contentX = boundsX + doc.baseImage.extraPaddingPts.left;
  const contentY = boundsY + doc.baseImage.extraPaddingPts.top;
  const contentWidth = boundsWidth - doc.baseImage.extraPaddingPts.left - doc.baseImage.extraPaddingPts.right;
  const contentHeight = boundsHeight - doc.baseImage.extraPaddingPts.top - doc.baseImage.extraPaddingPts.bottom;
  
  // Validate that we have positive dimensions
  if (contentWidth <= 0 || contentHeight <= 0) {
    console.error('Invalid content dimensions:', { contentWidth, contentHeight, boundsWidth, boundsHeight, extraPadding: doc.baseImage.extraPaddingPts });
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  ctx.save();
  
  // Calculate dimensions based on fit mode
  let drawWidth = img.width;
  let drawHeight = img.height;
  const imgRatio = img.width / img.height;
  const areaRatio = contentWidth / contentHeight;
  
  if (doc.baseImage.fitMode === 'contain') {
    if (imgRatio > areaRatio) {
      drawWidth = contentWidth;
      drawHeight = contentWidth / imgRatio;
    } else {
      drawHeight = contentHeight;
      drawWidth = contentHeight * imgRatio;
    }
  } else if (doc.baseImage.fitMode === 'cover') {
    if (imgRatio > areaRatio) {
      drawHeight = contentHeight;
      drawWidth = contentHeight * imgRatio;
    } else {
      drawWidth = contentWidth;
      drawHeight = contentWidth / imgRatio;
    }
  } else if (doc.baseImage.fitMode === 'fill-width') {
    drawWidth = contentWidth;
    drawHeight = doc.baseImage.lockAspectRatio ? (contentWidth / imgRatio) : contentHeight;
  } else if (doc.baseImage.fitMode === 'fill-height') {
    drawHeight = contentHeight;
    drawWidth = doc.baseImage.lockAspectRatio ? (contentHeight * imgRatio) : contentWidth;
  } else if (doc.baseImage.fitMode === 'stretch') {
    drawWidth = contentWidth;
    drawHeight = contentHeight;
  }
  
  // Calculate base position (centered in content area)
  let drawX = contentX + (contentWidth - drawWidth) / 2;
  let drawY = contentY + (contentHeight - drawHeight) / 2;
  
  // Apply manual offset based on anchor
  if (doc.baseImage.offsetAnchor === 'corner') {
    // Offset from top-left corner
    drawX = contentX + doc.baseImage.offsetXPts;
    drawY = contentY + doc.baseImage.offsetYPts;
  } else {
    // Offset from center (add to centered position)
    drawX += doc.baseImage.offsetXPts;
    drawY += doc.baseImage.offsetYPts;
  }
  
  // Apply rotation around image center
  if (doc.baseImage.rotation !== 0) {
    const centerX = drawX + drawWidth / 2;
    const centerY = drawY + drawHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((doc.baseImage.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }
  
  // Validate dimensions before drawing
  if (drawWidth <= 0 || drawHeight <= 0) {
    console.error('Invalid draw dimensions:', { drawWidth, drawHeight });
    ctx.restore();
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
  
  return { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
}

async function drawQRCode(
  ctx: CanvasRenderingContext2D,
  doc: DocumentModel,
  qrCanvas: HTMLCanvasElement,
  logoBlob?: Blob
): Promise<void> {
  // Calculate QR position based on canvas anchor + offset + QR anchor
  const qrPosition = calculateQRPosition(doc);
  
  ctx.save();
  
  // Apply rotation around QR center
  if (doc.qr.rotation !== 0) {
    const centerX = qrPosition.x + doc.qr.sizePts / 2;
    const centerY = qrPosition.y + doc.qr.sizePts / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((doc.qr.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }
  
  // Always draw the QR background first to ensure visibility
  if (!doc.qr.style.transparentBg) {
    ctx.fillStyle = doc.qr.style.bgColor;
    ctx.fillRect(qrPosition.x, qrPosition.y, doc.qr.sizePts, doc.qr.sizePts);
  }
  
  // Draw the QR code canvas at high resolution
  // The qrCanvas is already at the correct resolution (sizePts * scale)
  // When drawn in the scaled context, this will use all available pixels
  ctx.globalCompositeOperation = 'source-over';
  // Disable smoothing for crisp QR code rendering
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qrCanvas, qrPosition.x, qrPosition.y, doc.qr.sizePts, doc.qr.sizePts);
  
  // Draw logo separately at full resolution if enabled
  if (doc.qr.logo.enabled && logoBlob) {
    await drawQRLogo(ctx, doc, qrPosition, logoBlob);
  }
  
  ctx.restore();
}

async function drawQRLogo(
  ctx: CanvasRenderingContext2D,
  doc: DocumentModel,
  qrPosition: { x: number; y: number },
  logoBlob: Blob
): Promise<void> {
  // Load logo at full resolution
  const logoImg = await createImageBitmap(logoBlob, {
    resizeQuality: 'high',
  });
  
  // Calculate logo size and position
  const logoSize = (doc.qr.sizePts * doc.qr.logo.sizePct) / 100;
  const logoX = qrPosition.x + (doc.qr.sizePts - logoSize) / 2;
  const logoY = qrPosition.y + (doc.qr.sizePts - logoSize) / 2;
  
  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Draw backing if enabled
  if (doc.qr.logo.backingEnabled) {
    ctx.fillStyle = doc.qr.logo.backingColor;
    if (doc.qr.logo.backingRadiusPts > 0) {
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, logoSize, logoSize, doc.qr.logo.backingRadiusPts);
      ctx.fill();
    } else {
      ctx.fillRect(logoX, logoY, logoSize, logoSize);
    }
  }
  
  // Calculate aspect ratio and fit logo
  const logoAspect = logoImg.width / logoImg.height;
  let drawWidth = logoSize;
  let drawHeight = logoSize;
  let drawX = logoX;
  let drawY = logoY;
  
  if (logoAspect > 1) {
    drawHeight = logoSize / logoAspect;
    drawY = logoY + (logoSize - drawHeight) / 2;
  } else if (logoAspect < 1) {
    drawWidth = logoSize * logoAspect;
    drawX = logoX + (logoSize - drawWidth) / 2;
  }
  
  // Draw logo at full resolution
  ctx.drawImage(logoImg, drawX, drawY, drawWidth, drawHeight);
}

function drawLabel(ctx: CanvasRenderingContext2D, doc: DocumentModel, text: string): void {
  const qrPos = calculateQRPosition(doc);
  
  ctx.save();
  
  // Set font
  const fontWeight = doc.label.font.weight === 'bold' ? 'bold' : 'normal';
  ctx.font = `${fontWeight} ${doc.label.font.sizePts}px ${doc.label.font.family}`;
  ctx.fillStyle = doc.label.font.color;
  ctx.textBaseline = 'top';
  
  // Calculate text box width
  let textBoxWidth = doc.qr.sizePts;
  if (doc.label.textBoxWidthMode === 'custom' && doc.label.textBoxWidthPts) {
    textBoxWidth = doc.label.textBoxWidthPts;
  }
  
  // Wrap text
  const lines = wrapText(ctx, text, textBoxWidth, doc.label.wrap.mode, doc.label.wrap.maxLines);
  
  // Apply ellipsis if needed
  let displayLines = lines;
  if (doc.label.wrap.ellipsis && lines.length > doc.label.wrap.maxLines) {
    displayLines = lines.slice(0, doc.label.wrap.maxLines);
    const lastLine = displayLines[displayLines.length - 1];
    displayLines[displayLines.length - 1] = truncateWithEllipsis(ctx, lastLine, textBoxWidth);
  }
  
  // Calculate label position based on orientation
  const lineHeight = doc.label.font.sizePts * doc.label.font.lineHeight;
  const totalTextHeight = displayLines.length * lineHeight;
  
  let labelX = qrPos.x;
  let labelY = qrPos.y;
  
  switch (doc.label.orientation) {
    case 'bottom':
      labelY = qrPos.y + doc.qr.sizePts + doc.label.gapPts;
      break;
    case 'top':
      labelY = qrPos.y - doc.label.gapPts - totalTextHeight;
      break;
    case 'left':
      labelX = qrPos.x - doc.label.gapPts - textBoxWidth;
      break;
    case 'right':
      labelX = qrPos.x + doc.qr.sizePts + doc.label.gapPts;
      break;
  }
  
  // Apply offsets
  labelX += doc.label.offsetXPts;
  labelY += doc.label.offsetYPts;
  
  // Apply rotation if enabled
  if (doc.label.rotateWithGroup && doc.qr.rotation !== 0) {
    const centerX = qrPos.x + doc.qr.sizePts / 2;
    const centerY = qrPos.y + doc.qr.sizePts / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((doc.qr.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }
  
  // Draw background box if enabled
  if (doc.label.box.enabled) {
    const boxPadding = doc.label.box.paddingPts;
    ctx.fillStyle = doc.label.box.color;
    
    if (doc.label.box.radiusPts > 0) {
      roundRect(
        ctx,
        labelX - boxPadding,
        labelY - boxPadding,
        textBoxWidth + boxPadding * 2,
        totalTextHeight + boxPadding * 2,
        doc.label.box.radiusPts
      );
    } else {
      ctx.fillRect(
        labelX - boxPadding,
        labelY - boxPadding,
        textBoxWidth + boxPadding * 2,
        totalTextHeight + boxPadding * 2
      );
    }
  }
  
  // Draw text lines
  ctx.fillStyle = doc.label.font.color;
  displayLines.forEach((line, i) => {
    let lineX = labelX;
    
    // Apply alignment
    if (doc.label.align === 'center') {
      const lineWidth = ctx.measureText(line).width;
      lineX = labelX + (textBoxWidth - lineWidth) / 2;
    } else if (doc.label.align === 'end') {
      const lineWidth = ctx.measureText(line).width;
      lineX = labelX + textBoxWidth - lineWidth;
    }
    
    const lineY = labelY + i * lineHeight;
    
    // Draw outline if enabled
    if (doc.label.outline.enabled) {
      ctx.strokeStyle = doc.label.outline.color;
      ctx.lineWidth = doc.label.outline.widthPts;
      ctx.strokeText(line, lineX, lineY);
    }
    
    ctx.fillText(line, lineX, lineY);
  });
  
  ctx.restore();
}

function drawOverlays(
  ctx: CanvasRenderingContext2D,
  doc: DocumentModel
): void {
  ctx.save();
  
  // Calculate key boundaries
  const bleedLeft = doc.bleed.enabled ? doc.bleed.leftPts : 0;
  const bleedTop = doc.bleed.enabled ? doc.bleed.topPts : 0;
  const bleedRight = doc.bleed.enabled ? doc.bleed.rightPts : 0;
  const bleedBottom = doc.bleed.enabled ? doc.bleed.bottomPts : 0;
  
  const trimLeft = bleedLeft;
  const trimTop = bleedTop;
  const trimRight = doc.page.widthPts - bleedRight;
  const trimBottom = doc.page.heightPts - bleedBottom;
  const trimWidth = trimRight - trimLeft;
  const trimHeight = trimBottom - trimTop;
  
  const safeMarginLeft = doc.safe.enabled ? doc.safe.leftPts : 0;
  const safeMarginTop = doc.safe.enabled ? doc.safe.topPts : 0;
  const safeMarginRight = doc.safe.enabled ? doc.safe.rightPts : 0;
  const safeMarginBottom = doc.safe.enabled ? doc.safe.bottomPts : 0;
  
  const safeTop = trimTop + safeMarginTop;
  const safeRight = trimRight - safeMarginRight;
  const safeBottom = trimBottom - safeMarginBottom;
  
  // Draw bleed area (red, transparent) - area outside trim line
  if (doc.bleed.enabled && (bleedLeft > 0 || bleedTop > 0 || bleedRight > 0 || bleedBottom > 0)) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
    
    // Top bleed
    if (bleedTop > 0) ctx.fillRect(0, 0, doc.page.widthPts, bleedTop);
    // Bottom bleed
    if (bleedBottom > 0) ctx.fillRect(0, trimBottom, doc.page.widthPts, bleedBottom);
    // Left bleed
    if (bleedLeft > 0) ctx.fillRect(0, trimTop, bleedLeft, trimHeight);
    // Right bleed
    if (bleedRight > 0) ctx.fillRect(trimRight, trimTop, bleedRight, trimHeight);
  }
  
  // Draw margin area (blue, transparent) - between trim line and safe area
  if (doc.safe.enabled && (safeMarginLeft > 0 || safeMarginTop > 0 || safeMarginRight > 0 || safeMarginBottom > 0)) {
    ctx.fillStyle = 'rgba(0, 102, 255, 0.15)';
    
    // Top margin
    if (safeMarginTop > 0) ctx.fillRect(trimLeft, trimTop, trimWidth, safeMarginTop);
    // Bottom margin
    if (safeMarginBottom > 0) ctx.fillRect(trimLeft, safeBottom, trimWidth, safeMarginBottom);
    // Left margin
    if (safeMarginLeft > 0) ctx.fillRect(trimLeft, safeTop, safeMarginLeft, safeBottom - safeTop);
    // Right margin
    if (safeMarginRight > 0) ctx.fillRect(safeRight, safeTop, safeMarginRight, safeBottom - safeTop);
  }
  
  // No overlay for safe area - it remains clear
  
  ctx.restore();
}

function calculateQRPosition(doc: DocumentModel): { x: number; y: number } {
  // Step 1: Get the canvas anchor point
  const canvasAnchorPoint = getCanvasAnchorPoint(
    doc.qr.canvasAnchor,
    doc.page.widthPts,
    doc.page.heightPts
  );
  
  // Step 2: Apply offset
  const anchoredPoint = {
    x: canvasAnchorPoint.x + doc.qr.offsetXPts,
    y: canvasAnchorPoint.y + doc.qr.offsetYPts,
  };
  
  // Step 3: Convert to top-left position based on QR anchor
  const topLeftPos = getAnchorPosition(
    anchoredPoint,
    doc.qr.qrAnchor,
    doc.qr.sizePts,
    doc.qr.sizePts
  );
  
  return topLeftPos;
}

function getCanvasAnchorPoint(
  anchor: Anchor,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  switch (anchor) {
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
}

function getAnchorPosition(
  pos: { x: number; y: number },
  anchor: Anchor,
  width: number,
  height: number
): { x: number; y: number } {
  switch (anchor) {
    case 'tl':
      return { x: pos.x, y: pos.y };
    case 'tr':
      return { x: pos.x - width, y: pos.y };
    case 'bl':
      return { x: pos.x, y: pos.y - height };
    case 'br':
      return { x: pos.x - width, y: pos.y - height };
    case 'center':
      return { x: pos.x - width / 2, y: pos.y - height / 2 };
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  mode: 'word' | 'char' | 'none',
  maxLines: number
): string[] {
  if (mode === 'none') {
    return [text];
  }
  
  const lines: string[] = [];
  const words = mode === 'word' ? text.split(' ') : text.split('');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? (mode === 'word' ? ' ' : '') : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      
      if (lines.length >= maxLines) {
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  
  return lines;
}

function truncateWithEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  const ellipsis = '...';
  let truncated = text;
  
  while (truncated.length > 0) {
    const testText = truncated + ellipsis;
    const metrics = ctx.measureText(testText);
    
    if (metrics.width <= maxWidth) {
      return testText;
    }
    
    truncated = truncated.slice(0, -1);
  }
  
  return ellipsis;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

