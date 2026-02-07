import { useState, useEffect } from 'react';
import type { TemplateMeta, TemplateBundle, DocumentModel, TemplateAssets } from '../types';
import {
  getTemplatesIndex,
  getTemplate,
  saveTemplate,
  deleteTemplate,
  saveLastSelectedTemplateId,
} from '../utils/storage';
import { generateId } from '../utils/validation';
import { blobToBase64, base64ToBlob } from '../utils/template';
import { CollapsibleCard } from './CollapsibleCard';

interface TemplateManagerProps {
  doc: DocumentModel;
  baseImageBlob?: Blob;
  qrLogoBlob?: Blob;
  onLoadTemplate: (doc: DocumentModel, assets: TemplateAssets) => void;
  onClearAllData: () => void;
}

export function TemplateManager({ doc, baseImageBlob, qrLogoBlob, onLoadTemplate, onClearAllData }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const index = await getTemplatesIndex();
    setTemplates(index.sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const handleSaveTemplate = async (templateId: string | null, templateName: string) => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const isNewTemplate = !templateId;
    const meta: TemplateMeta = isNewTemplate
      ? {
          id: generateId(),
          name: templateName.trim(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      : {
          ...(await getTemplate(templateId))!.meta,
          updatedAt: Date.now(),
        };

    const assets: TemplateAssets = {};
    if (baseImageBlob) {
      assets.baseImageBlob = baseImageBlob;
      assets.baseImageMimeType = baseImageBlob.type;
    }
    if (qrLogoBlob) {
      assets.qrLogoBlob = qrLogoBlob;
      assets.qrLogoMimeType = qrLogoBlob.type;
    }

    const bundle: TemplateBundle = {
      schemaVersion: 1,
      meta,
      docModel: doc,
      assets,
      storeCsvData: false,
    };

    await saveTemplate(bundle);
    await saveLastSelectedTemplateId(meta.id);
    setSelectedId(meta.id);
    setShowSaveDialog(false);
    await loadTemplates();
    alert(isNewTemplate ? 'Template created successfully!' : 'Template updated successfully!');
  };

  const handleLoad = async (id: string) => {
    const bundle = await getTemplate(id);
    if (!bundle) {
      alert('Template not found');
      return;
    }

    setSelectedId(id);
    await saveLastSelectedTemplateId(id);
    onLoadTemplate(bundle.docModel, bundle.assets);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    await deleteTemplate(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
    await loadTemplates();
  };

  const handleExportTemplate = async (id: string) => {
    const bundle = await getTemplate(id);
    if (!bundle) {
      alert('Template not found');
      return;
    }

    // Convert blobs to base64 for JSON export
    const exportBundle: any = {
      ...bundle,
      assets: {},
    };

    if (bundle.assets.baseImageBlob) {
      exportBundle.assets.baseImage = await blobToBase64(bundle.assets.baseImageBlob);
      exportBundle.assets.baseImageMimeType = bundle.assets.baseImageMimeType;
    }

    if (bundle.assets.qrLogoBlob) {
      exportBundle.assets.qrLogo = await blobToBase64(bundle.assets.qrLogoBlob);
      exportBundle.assets.qrLogoMimeType = bundle.assets.qrLogoMimeType;
    }

    const json = JSON.stringify(exportBundle, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundle.meta.name.replace(/[^a-z0-9]/gi, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedBundle = JSON.parse(text);

      // Convert base64 back to blobs
      const bundle: TemplateBundle = {
        ...importedBundle,
        meta: {
          ...importedBundle.meta,
          id: generateId(), // New ID to avoid conflicts
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        assets: {},
      };

      if (importedBundle.assets.baseImage) {
        bundle.assets.baseImageBlob = base64ToBlob(importedBundle.assets.baseImage);
        bundle.assets.baseImageMimeType = importedBundle.assets.baseImageMimeType;
      }

      if (importedBundle.assets.qrLogo) {
        bundle.assets.qrLogoBlob = base64ToBlob(importedBundle.assets.qrLogo);
        bundle.assets.qrLogoMimeType = importedBundle.assets.qrLogoMimeType;
      }

      await saveTemplate(bundle);
      await loadTemplates();
      alert('Template imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import template. Please check the file format.');
    }

    // Reset file input
    e.target.value = '';
  };

  return (
    <CollapsibleCard title="Templates & Storage" icon="💾" defaultExpanded={false}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Save your current settings as reusable templates, load previously saved configurations, or clear all stored data from your browser.
      </p>
      
      <div style={{ marginBottom: '16px' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => setShowSaveDialog(true)}
        >
          💾 Save Current Settings as Template
        </button>
      </div>

      {showSaveDialog && (
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
          <div className="form-group">
            <label>Template Name</label>
            <input
              type="text"
              className="form-control"
              id="template-name-input"
              placeholder="Enter template name"
              autoFocus
            />
          </div>
          
          {templates.length > 0 && (
            <div className="form-group">
              <label>Or select existing to overwrite:</label>
              <select className="form-control" id="existing-template-select" defaultValue="">
                <option value="">-- Create New Template --</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="btn-group" style={{ marginTop: '8px' }}>
            <button 
              className="btn btn-success btn-small" 
              onClick={() => {
                const nameInput = document.getElementById('template-name-input') as HTMLInputElement;
                const selectInput = document.getElementById('existing-template-select') as HTMLSelectElement;
                const selectedTemplateId = selectInput?.value || null;
                
                if (selectedTemplateId) {
                  // Overwrite existing
                  handleSaveTemplate(selectedTemplateId, nameInput.value);
                } else {
                  // Create new
                  handleSaveTemplate(null, nameInput.value);
                }
              }}
            >
              Save
            </button>
            <button 
              className="btn btn-secondary btn-small" 
              onClick={() => setShowSaveDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {templates.length > 0 && (
        <>
          <div style={{ marginBottom: '8px', marginTop: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#2c3e50' }}>Load From Saved Templates:</strong>
          </div>
          <div className="template-list">
            {templates.map(template => (
              <div
                key={template.id}
                className={`template-item ${selectedId === template.id ? 'active' : ''}`}
                onClick={() => handleLoad(template.id)}
              >
                <div>
                  <div className="template-name">{template.name}</div>
                  <div className="template-date">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={e => {
                      e.stopPropagation();
                      handleExportTemplate(template.id);
                    }}
                    title="Export to file"
                  >
                    ⬇
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(template.id);
                    }}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label>Import Template from File</label>
        <input
          type="file"
          className="form-control"
          accept=".json"
          onChange={handleImportTemplate}
        />
      </div>

      <div style={{ borderTop: '2px solid #dee2e6', marginTop: '20px', paddingTop: '16px' }}>
        <button
          className="btn btn-danger"
          style={{ width: '100%' }}
          onClick={onClearAllData}
        >
          🗑️ Clear All Saved Data
        </button>
        <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
          This will delete all templates, settings, and images from browser storage
        </p>
      </div>
    </CollapsibleCard>
  );
}
