import type { DataRow } from '../types';

export function renderLabelTemplate(
  template: string,
  row: DataRow,
  derivedId: string
): string {
  let result = template;
  
  // Replace {index}
  result = result.replace(/{index}/g, row.index.toString());
  
  // Replace {id} and {short}
  result = result.replace(/{id}/g, derivedId);
  result = result.replace(/{short}/g, derivedId);
  
  // Replace {col:HeaderName} with CSV column values
  if (row.rawData) {
    const colRegex = /{col:([^}]+)}/g;
    result = result.replace(colRegex, (_, colName) => {
      return row.rawData?.[colName] || '';
    });
  }
  
  return result;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const contentType = parts[0].match(/:(.*?);/)?.[1] || '';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: contentType });
}
