import { useState } from 'react';
import type { DocumentModel, DataMode, DataRow } from '../types';
import { getCsvHeaders } from '../utils/dataProcessor';
import { CollapsibleCard } from './CollapsibleCard';

interface DataInputProps {
  doc: DocumentModel;
  rows: DataRow[];
  onChange: (updates: Partial<DocumentModel>) => void;
}

export function DataInput({ doc, rows, onChange }: DataInputProps) {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const handleModeChange = (mode: DataMode) => {
    onChange({
      data: { ...doc.data, mode },
    });
  };

  const handleUrlsTextChange = (text: string) => {
    onChange({
      data: { ...doc.data, urlsText: text },
    });
  };

  const handleCsvTextChange = (text: string) => {
    const headers = getCsvHeaders(text);
    setCsvHeaders(headers);
    
    onChange({
      data: { ...doc.data, csvText: text },
    });
  };

  const handleCsvConfigChange = (key: string, value: any) => {
    onChange({
      data: {
        ...doc.data,
        csvConfig: { ...doc.data.csvConfig, [key]: value },
      },
    });
  };

  const handleDeriveChange = (key: string, value: any) => {
    onChange({
      data: {
        ...doc.data,
        derive: { ...doc.data.derive, [key]: value },
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleCsvTextChange(text);
    };
    reader.readAsText(file);
    // Clear the input value to allow re-selection of the same file
    e.target.value = '';
  };

  const validRows = rows.filter(r => r.errors.length === 0);
  const errorRows = rows.filter(r => r.errors.length > 0);

  return (
    <CollapsibleCard title="Data Input" icon="📊" defaultExpanded={true}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Provide the data that will be encoded into QR codes. Each URL or row will generate a separate page in the PDF.
      </p>
      
      <div className="tabs">
        <button
          className={`tab ${doc.data.mode === 'urls' ? 'active' : ''}`}
          onClick={() => handleModeChange('urls')}
        >
          URL List
        </button>
        <button
          className={`tab ${doc.data.mode === 'csv' ? 'active' : ''}`}
          onClick={() => handleModeChange('csv')}
        >
          CSV
        </button>
      </div>

      {doc.data.mode === 'urls' ? (
        <>
          <div className="form-group">
            <label>URLs (one per line)</label>
            <textarea
              className="form-control"
              rows={8}
              value={doc.data.urlsText}
              onChange={e => handleUrlsTextChange(e.target.value)}
              placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="derive-enabled"
              checked={doc.data.derive.enabled}
              onChange={e => handleDeriveChange('enabled', e.target.checked)}
            />
            <label htmlFor="derive-enabled">Auto-derive labels from URLs</label>
          </div>

          {doc.data.derive.enabled && (
            <>
              <div className="form-group">
                <label>Derive Method</label>
                <select
                  className="form-control"
                  value={doc.data.derive.method}
                  onChange={e => handleDeriveChange('method', e.target.value)}
                >
                  <option value="lastPathSegment">Last path segment</option>
                  <option value="regex">Regex pattern</option>
                </select>
              </div>

              {doc.data.derive.method === 'regex' && (
                <div className="form-group">
                  <label>Regex (first capture group)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={doc.data.derive.regex || ''}
                    onChange={e => handleDeriveChange('regex', e.target.value)}
                    placeholder="e.g., /id/(\d+)"
                  />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Upload CSV File</label>
            <input
              type="file"
              className="form-control"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>

          <div className="form-group">
            <label>Or paste CSV text</label>
            <textarea
              className="form-control"
              rows={8}
              value={doc.data.csvText}
              onChange={e => handleCsvTextChange(e.target.value)}
              placeholder="url,label&#10;https://example.com/1,Item 1&#10;https://example.com/2,Item 2"
            />
          </div>

          {csvHeaders.length > 0 && (
            <>
              <div className="form-group">
                <label>Payload Column</label>
                <select
                  className="form-control"
                  value={doc.data.csvConfig.payloadColumn}
                  onChange={e => handleCsvConfigChange('payloadColumn', e.target.value)}
                >
                  {csvHeaders.map(header => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Label Column (optional)</label>
                <select
                  className="form-control"
                  value={doc.data.csvConfig.labelColumn}
                  onChange={e => handleCsvConfigChange('labelColumn', e.target.value)}
                >
                  <option value="">None</option>
                  {csvHeaders.map(header => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Label Template</label>
                <input
                  type="text"
                  className="form-control"
                  value={doc.data.csvConfig.labelTemplate}
                  onChange={e => handleCsvConfigChange('labelTemplate', e.target.value)}
                  placeholder="{label} or {index} or {col:Name}"
                />
                <small style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                  Variables: {'{index}'}, {'{id}'}, {'{short}'}, {'{col:HeaderName}'}
                </small>
              </div>
            </>
          )}

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="csv-derive-enabled"
              checked={doc.data.derive.enabled}
              onChange={e => handleDeriveChange('enabled', e.target.checked)}
            />
            <label htmlFor="csv-derive-enabled">Derive ID if label missing</label>
          </div>

          {doc.data.derive.enabled && (
            <>
              <div className="form-group">
                <label>Derive Method</label>
                <select
                  className="form-control"
                  value={doc.data.derive.method}
                  onChange={e => handleDeriveChange('method', e.target.value)}
                >
                  <option value="lastPathSegment">Last path segment</option>
                  <option value="regex">Regex pattern</option>
                </select>
              </div>

              {doc.data.derive.method === 'regex' && (
                <div className="form-group">
                  <label>Regex (first capture group)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={doc.data.derive.regex || ''}
                    onChange={e => handleDeriveChange('regex', e.target.value)}
                    placeholder="e.g., /id/(\d+)"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="allow-non-http"
          checked={doc.data.csvConfig.allowNonHttpSchemes}
          onChange={e => handleCsvConfigChange('allowNonHttpSchemes', e.target.checked)}
        />
        <label htmlFor="allow-non-http">Allow non-HTTP schemes</label>
      </div>

      {rows.length > 0 && (
        <div className="info-box">
          <strong>Data Summary</strong>
          <div>Total rows: {rows.length}</div>
          <div>Valid: {validRows.length}</div>
          {errorRows.length > 0 && (
            <div style={{ color: '#e74c3c' }}>Errors: {errorRows.length}</div>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '12px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Payload</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map(row => (
                <tr key={row.index} className={row.errors.length > 0 ? 'error' : ''}>
                  <td>{row.index}</td>
                  <td style={{ fontSize: '11px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.payload}
                  </td>
                  <td>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 10 && (
            <div style={{ fontSize: '11px', color: '#999', marginTop: '8px', textAlign: 'center' }}>
              Showing first 10 of {rows.length} rows
            </div>
          )}
        </div>
      )}
    </CollapsibleCard>
  );
}
