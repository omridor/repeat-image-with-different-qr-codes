import Papa from 'papaparse';
import type { DataConfig, DataRow } from '../types';
import { isValidUrl, deriveIdFromUrl } from './validation';
import { renderLabelTemplate } from './template';

export function processData(dataConfig: DataConfig): DataRow[] {
  if (dataConfig.mode === 'urls') {
    return processUrls(dataConfig);
  } else {
    return processCsv(dataConfig);
  }
}

function processUrls(dataConfig: DataConfig): DataRow[] {
  const lines = dataConfig.urlsText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  return lines.map((url, index) => {
    const errors: string[] = [];
    
    // Validate URL
    if (!isValidUrl(url, dataConfig.csvConfig.allowNonHttpSchemes)) {
      errors.push(`Invalid URL: ${url}`);
    }
    
    // Derive ID if enabled
    let derivedId = '';
    if (dataConfig.derive.enabled) {
      derivedId = deriveIdFromUrl(url, dataConfig.derive.method, dataConfig.derive.regex);
    }
    
    // Generate label
    let label = '';
    if (dataConfig.derive.enabled && derivedId) {
      label = derivedId;
    } else if (dataConfig.csvConfig.labelTemplate) {
      label = renderLabelTemplate(
        dataConfig.csvConfig.labelTemplate,
        { payload: url, label: '', index: index + 1, errors: [], rawData: {} },
        derivedId
      );
    }
    
    return {
      payload: url,
      label,
      index: index + 1,
      errors,
      rawData: {},
    };
  });
}

function processCsv(dataConfig: DataConfig): DataRow[] {
  if (!dataConfig.csvText.trim()) {
    return [];
  }
  
  const parsed = Papa.parse(dataConfig.csvText, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (parsed.errors.length > 0) {
    console.error('CSV parsing errors:', parsed.errors);
  }
  
  const rows: DataRow[] = [];
  const payloadCol = dataConfig.csvConfig.payloadColumn;
  const labelCol = dataConfig.csvConfig.labelColumn;
  
  parsed.data.forEach((row: any, index: number) => {
    const errors: string[] = [];
    const payload = row[payloadCol] || '';
    
    // Validate payload
    if (!payload) {
      errors.push(`Missing payload column: ${payloadCol}`);
    } else if (!isValidUrl(payload, dataConfig.csvConfig.allowNonHttpSchemes)) {
      errors.push(`Invalid URL: ${payload}`);
    }
    
    // Get label from column or derive
    let label = row[labelCol] || '';
    let derivedId = '';
    
    if (!label && dataConfig.derive.enabled && payload) {
      derivedId = deriveIdFromUrl(payload, dataConfig.derive.method, dataConfig.derive.regex);
      label = derivedId;
    }
    
    // Apply label template if configured
    if (dataConfig.csvConfig.labelTemplate && dataConfig.csvConfig.labelTemplate !== '{label}') {
      const tempRow: DataRow = {
        payload,
        label,
        index: index + 1,
        errors: [],
        rawData: row,
      };
      label = renderLabelTemplate(dataConfig.csvConfig.labelTemplate, tempRow, derivedId);
    }
    
    rows.push({
      payload,
      label,
      index: index + 1,
      errors,
      rawData: row,
    });
  });
  
  return rows;
}

export function getCsvHeaders(csvText: string): string[] {
  if (!csvText.trim()) {
    return [];
  }
  
  const parsed = Papa.parse(csvText, {
    header: true,
    preview: 1,
  });
  
  return parsed.meta.fields || [];
}
