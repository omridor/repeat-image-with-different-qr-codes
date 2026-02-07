import { PDFDocument, rgb, StandardFonts, PDFPage, PDFImage } from 'pdf-lib';
import type { DocumentModel, DataRow } from '../types';
import { generateQRCodeImage } from './qrGenerator';

export interface ExportOptions {
  doc: DocumentModel;
  rows: DataRow[];
  baseImageBlob?: Blob;
  qrLogoBlob?: Blob;
  onProgress?: (current: number, total: number) => void;
}

export async function exportPDF(options: ExportOptions): Promise<Uint8Array> {
  const { doc, rows, baseImageBlob, qrLogoBlob, onProgress } = options;
  
  const pdfDoc = await PDFDocument.create();
  
  // Load base image if provided
  let baseImage: PDFImage | undefined;
  if (baseImageBlob) {
    const arrayBuffer = await baseImageBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    try {
      if (baseImageBlob.type.includes('png')) {
        baseImage = await pdfDoc.embedPng(bytes);
      } else if (baseImageBlob.type.includes('jpeg') || baseImageBlob.type.includes('jpg')) {
        baseImage = await pdfDoc.embedJpg(bytes);
      }
    } catch (error) {
      console.error('Failed to embed base image:', error);
    }
  }
  
  // Generate pages
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    if (onProgress) {
      onProgress(i + 1, rows.length);
    }
    
    if (row.errors.length > 0) {
      console.warn(`Skipping row ${i + 1} due to errors:`, row.errors);
      continue;
    }
    
    const page = pdfDoc.addPage([doc.page.widthPts, doc.page.heightPts]);
    
    // Draw base image
    if (baseImage) {
      await drawBaseImageOnPage(page, doc, baseImage);
    }
    
    // Generate and draw QR code (without logo embedded)
    const qrBlob = await generateQRCodeImage(row.payload, doc.qr, qrLogoBlob);
    const qrArrayBuffer = await qrBlob.arrayBuffer();
    const qrImage = await pdfDoc.embedPng(new Uint8Array(qrArrayBuffer));
    
    // Embed logo separately if enabled
    let logoImage: PDFImage | undefined;
    if (doc.qr.logo.enabled && qrLogoBlob) {
      try {
        const logoArrayBuffer = await qrLogoBlob.arrayBuffer();
        const logoBytes = new Uint8Array(logoArrayBuffer);
        
        // Detect image type and embed accordingly
        if (qrLogoBlob.type === 'image/png' || qrLogoBlob.type.includes('png')) {
          logoImage = await pdfDoc.embedPng(logoBytes);
        } else if (qrLogoBlob.type === 'image/jpeg' || qrLogoBlob.type === 'image/jpg' || qrLogoBlob.type.includes('jpeg')) {
          logoImage = await pdfDoc.embedJpg(logoBytes);
        } else {
          console.warn('Unsupported logo format for PDF:', qrLogoBlob.type);
        }
      } catch (error) {
        console.error('Failed to embed logo in PDF:', error);
        // Continue without logo rather than failing
      }
    }
    
    drawQRCodeOnPage(page, doc, qrImage, logoImage);
    
    // Draw label
    if (doc.label.enabled && row.label) {
      await drawLabelOnPage(page, doc, row.label, pdfDoc);
    }
  }
  
  return await pdfDoc.save();
}

async function drawBaseImageOnPage(
  page: PDFPage,
  doc: DocumentModel,
  image: PDFImage
): Promise<void> {
  // Calculate bounds based on placementBounds setting
  let boundsX = 0;
  let boundsY = 0; // PDF uses bottom-left origin
  let boundsWidth = doc.page.widthPts;
  let boundsHeight = doc.page.heightPts;
  
  if (doc.baseImage.placementBounds === 'canvas') {
    // Trim area (inside bleed)
    const bleedLeft = doc.bleed.enabled ? doc.bleed.leftPts : 0;
    const bleedRight = doc.bleed.enabled ? doc.bleed.rightPts : 0;
    const bleedTop = doc.bleed.enabled ? doc.bleed.topPts : 0;
    const bleedBottom = doc.bleed.enabled ? doc.bleed.bottomPts : 0;
    
    boundsX = bleedLeft;
    boundsY = bleedBottom;
    boundsWidth = doc.page.widthPts - bleedLeft - bleedRight;
    boundsHeight = doc.page.heightPts - bleedTop - bleedBottom;
  } else if (doc.baseImage.placementBounds === 'safe-area') {
    // Safe area (inside bleed and safe margins)
    const bleedLeft = doc.bleed.enabled ? doc.bleed.leftPts : 0;
    const bleedRight = doc.bleed.enabled ? doc.bleed.rightPts : 0;
    const bleedTop = doc.bleed.enabled ? doc.bleed.topPts : 0;
    const bleedBottom = doc.bleed.enabled ? doc.bleed.bottomPts : 0;
    
    const safeLeft = doc.safe.enabled ? doc.safe.leftPts : 0;
    const safeRight = doc.safe.enabled ? doc.safe.rightPts : 0;
    const safeTop = doc.safe.enabled ? doc.safe.topPts : 0;
    const safeBottom = doc.safe.enabled ? doc.safe.bottomPts : 0;
    
    boundsX = bleedLeft + safeLeft;
    boundsY = bleedBottom + safeBottom;
    boundsWidth = doc.page.widthPts - bleedLeft - bleedRight - safeLeft - safeRight;
    boundsHeight = doc.page.heightPts - bleedTop - bleedBottom - safeTop - safeBottom;
  }
  // For 'bleed-area', use full page (default values)
  
  // Apply extra padding
  const contentX = boundsX + doc.baseImage.extraPaddingPts.left;
  const contentY = boundsY + doc.baseImage.extraPaddingPts.bottom;
  const contentWidth = boundsWidth - doc.baseImage.extraPaddingPts.left - doc.baseImage.extraPaddingPts.right;
  const contentHeight = boundsHeight - doc.baseImage.extraPaddingPts.top - doc.baseImage.extraPaddingPts.bottom;
  
  // Get image dimensions
  const imgDims = image.scale(1);
  const imgRatio = imgDims.width / imgDims.height;
  const areaRatio = contentWidth / contentHeight;
  
  // Calculate dimensions based on fit mode
  let drawWidth = imgDims.width;
  let drawHeight = imgDims.height;
  
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
    // Offset from top-left corner (adjusted for PDF's bottom-left origin)
    drawX = contentX + doc.baseImage.offsetXPts;
    drawY = contentY + (contentHeight - drawHeight) - doc.baseImage.offsetYPts;
  } else {
    // Offset from center
    drawX += doc.baseImage.offsetXPts;
    drawY -= doc.baseImage.offsetYPts; // Inverted for PDF coordinate system
  }
  
  page.drawImage(image, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
    rotate: {
      angle: doc.baseImage.rotation,
    },
  });
}

function drawQRCodeOnPage(
  page: PDFPage,
  doc: DocumentModel,
  qrImage: PDFImage,
  logoImage?: PDFImage
): void {
  const pos = calculateQRPositionPDF(doc);
  
  // Draw QR code
  page.drawImage(qrImage, {
    x: pos.x,
    y: pos.y,
    width: doc.qr.sizePts,
    height: doc.qr.sizePts,
    rotate: {
      angle: doc.qr.rotation,
    },
  });
  
  // Draw logo separately at full resolution if provided  
  if (logoImage && doc.qr.logo.enabled) {
    const logoSize = (doc.qr.sizePts * doc.qr.logo.sizePct) / 100;
    const logoX = pos.x + (doc.qr.sizePts - logoSize) / 2;
    const logoY = pos.y + (doc.qr.sizePts - logoSize) / 2;
    
    // Draw backing if enabled
    if (doc.qr.logo.backingEnabled) {
      const color = parseColor(doc.qr.logo.backingColor);
      const radius = doc.qr.logo.backingRadiusPts;
      
      if (radius > 0) {
        // Draw rounded rectangle using path operations
        drawRoundedRectangle(page, logoX, logoY, logoSize, logoSize, radius, rgb(color.r, color.g, color.b));
      } else {
        // Draw regular rectangle
        page.drawRectangle({
          x: logoX,
          y: logoY,
          width: logoSize,
          height: logoSize,
          color: rgb(color.r, color.g, color.b),
        });
      }
    }
    
    // Calculate aspect ratio and fit logo
    const logoDims = logoImage.scale(1);
    const logoAspect = logoDims.width / logoDims.height;
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
    
    // Draw logo at full resolution (no rotation needed as it's positioned relative to QR)
    page.drawImage(logoImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }
}

function parseColor(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 1, g: 1, b: 1 };
}

async function drawLabelOnPage(
  page: PDFPage,
  doc: DocumentModel,
  text: string,
  pdfDoc: PDFDocument
): Promise<void> {
  // Load font
  let font;
  switch (doc.label.font.family) {
    case 'Helvetica':
      font = doc.label.font.weight === 'bold' 
        ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        : await pdfDoc.embedFont(StandardFonts.Helvetica);
      break;
    case 'TimesRoman':
      font = doc.label.font.weight === 'bold'
        ? await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
        : await pdfDoc.embedFont(StandardFonts.TimesRoman);
      break;
    case 'Courier':
      font = doc.label.font.weight === 'bold'
        ? await pdfDoc.embedFont(StandardFonts.CourierBold)
        : await pdfDoc.embedFont(StandardFonts.Courier);
      break;
    default:
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
  
  const fontSize = doc.label.font.sizePts;
  const qrPos = calculateQRPositionPDF(doc);
  
  // Calculate text box width
  let textBoxWidth = doc.qr.sizePts;
  if (doc.label.textBoxWidthMode === 'custom' && doc.label.textBoxWidthPts) {
    textBoxWidth = doc.label.textBoxWidthPts;
  }
  
  // Wrap text (simplified for PDF)
  const lines = wrapTextPDF(text, textBoxWidth, fontSize, font, doc.label.wrap.maxLines);
  
  // Calculate label position
  const lineHeight = fontSize * doc.label.font.lineHeight;
  const totalTextHeight = lines.length * lineHeight;
  
  let labelX = qrPos.x;
  let labelY = qrPos.y;
  
  // In PDF coords, qrPos.y is the BOTTOM of the QR code
  switch (doc.label.orientation) {
    case 'bottom':
      // Label below QR (visually) - place it below the QR bottom
      labelY = qrPos.y - doc.label.gapPts - totalTextHeight;
      break;
    case 'top':
      // Label above QR (visually) - place it above the QR top
      labelY = qrPos.y + doc.qr.sizePts + doc.label.gapPts;
      break;
    case 'left':
      labelX = qrPos.x - doc.label.gapPts - textBoxWidth;
      labelY = qrPos.y + (doc.qr.sizePts - totalTextHeight) / 2; // Center vertically with QR
      break;
    case 'right':
      labelX = qrPos.x + doc.qr.sizePts + doc.label.gapPts;
      labelY = qrPos.y + (doc.qr.sizePts - totalTextHeight) / 2; // Center vertically with QR
      break;
  }
  
  // Apply offsets (Y is inverted for PDF coordinate system)
  labelX += doc.label.offsetXPts;
  labelY -= doc.label.offsetYPts; // Invert Y offset for PDF coords
  
  // Draw background box if enabled
  if (doc.label.box.enabled) {
    const padding = doc.label.box.paddingPts;
    const boxColor = hexToRgb(doc.label.box.color);
    
    page.drawRectangle({
      x: labelX - padding,
      y: labelY - padding,
      width: textBoxWidth + padding * 2,
      height: totalTextHeight + padding * 2,
      color: rgb(boxColor.r, boxColor.g, boxColor.b),
    });
  }
  
  // Draw text lines
  const textColor = hexToRgb(doc.label.font.color);
  
  // Canvas uses textBaseline='top' (Y at top of text)
  // PDF uses baseline (Y at baseline, no way to change this)
  // User testing shows we need the full fontSize to align properly
  const ascent = 0; // Full font size moves baseline up to align with Canvas 'top'
  
  lines.forEach((line, i) => {
    let lineX = labelX;
    
    // Apply alignment
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    if (doc.label.align === 'center') {
      lineX = labelX + (textBoxWidth - lineWidth) / 2;
    } else if (doc.label.align === 'end') {
      lineX = labelX + textBoxWidth - lineWidth;
    }
    
    // Position baseline: bottom of box + lines below + full fontSize
    const lineY = labelY + (lines.length - 1 - i) * lineHeight + ascent;
    
    page.drawText(line, {
      x: lineX,
      y: lineY,
      size: fontSize,
      font,
      color: rgb(textColor.r, textColor.g, textColor.b),
    });
  });
}

function calculateQRPositionPDF(doc: DocumentModel): { x: number; y: number } {
  // Step 1: Get the canvas anchor point (in canvas coordinates - top-left origin)
  const canvasAnchorPoint = getCanvasAnchorPointPDF(
    doc.qr.canvasAnchor,
    doc.page.widthPts,
    doc.page.heightPts
  );
  
  // Step 2: Apply offset
  const anchoredPoint = {
    x: canvasAnchorPoint.x + doc.qr.offsetXPts,
    y: canvasAnchorPoint.y + doc.qr.offsetYPts,
  };
  
  // Step 3: Convert to top-left position based on QR anchor (still in canvas coords)
  const canvasTopLeftPos = getAnchorPositionCanvas(
    anchoredPoint,
    doc.qr.qrAnchor,
    doc.qr.sizePts,
    doc.qr.sizePts
  );
  
  // Step 4: Convert to PDF coordinates (bottom-left origin)
  const pdfY = doc.page.heightPts - canvasTopLeftPos.y - doc.qr.sizePts;
  
  return { x: canvasTopLeftPos.x, y: pdfY };
}

function getCanvasAnchorPointPDF(
  anchor: string,
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
    default:
      return { x: canvasWidth / 2, y: canvasHeight / 2 };
  }
}

function getAnchorPositionCanvas(
  pos: { x: number; y: number },
  anchor: string,
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
    default:
      return { x: pos.x - width / 2, y: pos.y - height / 2 };
  }
}

function wrapTextPDF(
  text: string,
  maxWidth: number,
  fontSize: number,
  font: any,
  maxLines: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width > maxWidth && currentLine) {
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

function drawRoundedRectangle(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: ReturnType<typeof rgb>
): void {
  // Clamp radius to not exceed half of width or height
  const maxRadius = Math.min(width, height) / 2;
  const r = Math.min(radius, maxRadius);
  
  // Approximate rounded rectangle using rectangles and ellipses
  // Draw main rectangles (horizontal and vertical strips)
  
  // Center horizontal rectangle (full width minus corners)
  page.drawRectangle({
    x: x + r,
    y: y,
    width: width - 2 * r,
    height: height,
    color: color,
    borderWidth: 0,
  });
  
  // Left vertical rectangle (corner height)
  page.drawRectangle({
    x: x,
    y: y + r,
    width: r,
    height: height - 2 * r,
    color: color,
    borderWidth: 0,
  });
  
  // Right vertical rectangle (corner height)
  page.drawRectangle({
    x: x + width - r,
    y: y + r,
    width: r,
    height: height - 2 * r,
    color: color,
    borderWidth: 0,
  });
  
  // Draw corner circles (ellipses)
  const diameter = r * 2;
  
  // Bottom-left corner
  page.drawEllipse({
    x: x + r,
    y: y + r,
    xScale: r,
    yScale: r,
    color: color,
    borderWidth: 0,
  });
  
  // Bottom-right corner
  page.drawEllipse({
    x: x + width - r,
    y: y + r,
    xScale: r,
    yScale: r,
    color: color,
    borderWidth: 0,
  });
  
  // Top-left corner
  page.drawEllipse({
    x: x + r,
    y: y + height - r,
    xScale: r,
    yScale: r,
    color: color,
    borderWidth: 0,
  });
  
  // Top-right corner
  page.drawEllipse({
    x: x + width - r,
    y: y + height - r,
    xScale: r,
    yScale: r,
    color: color,
    borderWidth: 0,
  });
}
