import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '../types';

export async function generateQRCodeImage(
  payload: string,
  qrConfig: QRConfig,
  logoBlob?: Blob
): Promise<Blob> {
  // Generate at higher resolution for PDF quality (4x)
  const hiResScale = 4;
  const hiResSize = qrConfig.sizePts * hiResScale;
  
  // Calculate logo area if enabled - clears center for logo
  const logoAreaSize = qrConfig.logo.enabled && logoBlob ? qrConfig.logo.sizePct / 100 : 0;
  
  const qrCode = new QRCodeStyling({
    width: hiResSize,
    height: hiResSize,
    data: payload,
    margin: qrConfig.style.quietZonePts * hiResScale,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: qrConfig.style.ecc,
    },
    imageOptions: {
      hideBackgroundDots: logoAreaSize > 0, // Clear center if logo enabled
      imageSize: logoAreaSize, // Size of cleared area
      margin: 0,
    },
    dotsOptions: {
      type: qrConfig.style.pattern,
      color: qrConfig.style.fgColor,
    },
    backgroundOptions: {
      color: qrConfig.style.transparentBg ? 'transparent' : qrConfig.style.bgColor,
    },
    cornersSquareOptions: {
      type: qrConfig.style.corners,
      color: qrConfig.style.fgColor,
    },
    cornersDotOptions: {
      type: qrConfig.style.corners,
      color: qrConfig.style.fgColor,
    },
    // Don't embed logo - we'll draw it separately in PDF
  });

  const blob = await qrCode.getRawData('png');
  if (!blob) {
    throw new Error('Failed to generate QR code');
  }
  
  return blob;
}

export async function generateQRCodeCanvas(
  payload: string,
  qrConfig: QRConfig,
  logoBlob?: Blob,
  previewScale: number = 1
): Promise<HTMLCanvasElement> {
  // For preview, generate at preview scale (usually 2x)
  // For PDF export (previewScale = 1), generate at 4x for high quality
  const hiResScale = previewScale > 1 ? previewScale * 2 : 4;
  const hiResSize = qrConfig.sizePts * hiResScale;
  
  // Calculate logo area if enabled - this tells the QR library to clear the center
  const logoAreaSize = qrConfig.logo.enabled && logoBlob ? qrConfig.logo.sizePct / 100 : 0;
  
  // Generate QR code with cleared center for logo
  const qrCode = new QRCodeStyling({
    width: hiResSize,
    height: hiResSize,
    data: payload,
    margin: qrConfig.style.quietZonePts * hiResScale,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: qrConfig.style.ecc,
    },
    imageOptions: {
      hideBackgroundDots: logoAreaSize > 0, // Clear center if logo is enabled
      imageSize: logoAreaSize, // Size of cleared area
      margin: 0,
    },
    dotsOptions: {
      type: qrConfig.style.pattern,
      color: qrConfig.style.fgColor,
    },
    backgroundOptions: {
      color: qrConfig.style.transparentBg ? 'transparent' : qrConfig.style.bgColor,
    },
    cornersSquareOptions: {
      type: qrConfig.style.corners,
      color: qrConfig.style.fgColor,
    },
    cornersDotOptions: {
      type: qrConfig.style.corners,
      color: qrConfig.style.fgColor,
    },
  });

  // Get the QR code as a blob
  const blob = await qrCode.getRawData('png');
  if (!blob) {
    throw new Error('Failed to generate QR code blob');
  }
  
  // Convert to canvas at scaled size for crisp rendering
  const qrImg = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  // Keep at higher resolution for preview
  canvas.width = qrConfig.sizePts * previewScale;
  canvas.height = qrConfig.sizePts * previewScale;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Draw QR code with high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height);
  
  return canvas;
}
