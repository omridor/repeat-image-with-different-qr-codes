import type { DocumentModel, UnitPreference } from '../types';
import { PAGE_PRESETS } from '../constants';
import { pointsToUnit, unitToPoints } from '../utils/units';
import { CollapsibleCard } from './CollapsibleCard';

interface PageSettingsProps {
  doc: DocumentModel;
  onChange: (updates: Partial<DocumentModel>) => void;
}

export function PageSettings({ doc, onChange }: PageSettingsProps) {
  const handlePresetChange = (presetId: string) => {
    const preset = PAGE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    onChange({
      page: {
        ...doc.page,
        presetId,
        widthPts: preset.widthPts,
        heightPts: preset.heightPts,
      },
    });
  };

  const handleUnitChange = (unit: UnitPreference) => {
    onChange({
      page: {
        ...doc.page,
        unitPreference: unit,
      },
    });
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    const pts = unitToPoints(value, doc.page.unitPreference);
    onChange({
      page: {
        ...doc.page,
        presetId: 'custom',
        [dimension === 'width' ? 'widthPts' : 'heightPts']: pts,
      },
    });
  };

  const handleMarginChange = (
    type: 'bleed' | 'safe',
    side: 'topPts' | 'rightPts' | 'bottomPts' | 'leftPts',
    value: number
  ) => {
    const pts = unitToPoints(value, doc.page.unitPreference);
    const config = doc[type];

    if (config.linked) {
      onChange({
        [type]: {
          ...config,
          topPts: pts,
          rightPts: pts,
          bottomPts: pts,
          leftPts: pts,
        },
      });
    } else {
      onChange({
        [type]: {
          ...config,
          [side]: pts,
        },
      });
    }
  };

  const handleMarginLinkToggle = (type: 'bleed' | 'safe') => {
    const config = doc[type];
    onChange({
      [type]: {
        ...config,
        linked: !config.linked,
      },
    });
  };

  return (
    <CollapsibleCard title="Output PDF Page Settings" icon="📄" defaultExpanded={true}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Configure the dimensions and margins for your output PDF pages. These settings determine the final size of each page in the exported PDF.
      </p>
      
      <div className="form-group">
        <label>Preset</label>
        <select
          className="form-control"
          value={doc.page.presetId}
          onChange={e => handlePresetChange(e.target.value)}
        >
          {PAGE_PRESETS.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Units</label>
        <div className="radio-group">
          {(['cm', 'in', 'mm'] as UnitPreference[]).map(unit => (
            <div key={unit} className="radio-item">
              <input
                type="radio"
                id={`unit-${unit}`}
                checked={doc.page.unitPreference === unit}
                onChange={() => handleUnitChange(unit)}
              />
              <label htmlFor={`unit-${unit}`}>{unit}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Width</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.page.widthPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleDimensionChange('width', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.page.heightPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleDimensionChange('height', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
      </div>

      <div className="config-panel">
        <div className="config-panel-header">
          <input
            type="checkbox"
            id="bleed-enabled"
            checked={doc.bleed.enabled}
            onChange={(e) => onChange({ bleed: { ...doc.bleed, enabled: e.target.checked } })}
          />
          <label htmlFor="bleed-enabled">Add Bleed Margin</label>
        </div>
        <p style={{ fontSize: '11px', color: '#666', marginTop: '4px', paddingLeft: '8px' }}>
          Adds extra area around your design that will be cut off during printing. This makes the output canvas larger than the selected size to prevent white edges.
        </p>

        {doc.bleed.enabled && (
          <div className="config-panel-content">
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ marginBottom: 0 }}>Bleed Size</label>
              <button
                className="btn btn-small btn-secondary"
                onClick={() => handleMarginLinkToggle('bleed')}
              >
                {doc.bleed.linked ? '🔗 Linked' : '🔓 Unlinked'}
              </button>
            </div>
          </div>

          {doc.bleed.linked ? (
        <div className="form-group">
          <label>All Sides</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.bleed.topPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleMarginChange('bleed', 'topPts', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
      ) : (
        <div className="form-row">
          <div className="form-group">
            <label>Top</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.bleed.topPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('bleed', 'topPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Right</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.bleed.rightPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('bleed', 'rightPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Bottom</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.bleed.bottomPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('bleed', 'bottomPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Left</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.bleed.leftPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('bleed', 'leftPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
        </div>
      )}
          </div>
        )}
      </div>

      <div className="config-panel">
        <div className="config-panel-header">
          <input
            type="checkbox"
            id="safe-enabled"
            checked={doc.safe.enabled}
            onChange={(e) => onChange({ safe: { ...doc.safe, enabled: e.target.checked } })}
          />
          <label htmlFor="safe-enabled">Add Safe Margins</label>
        </div>
        <p style={{ fontSize: '11px', color: '#666', marginTop: '4px', paddingLeft: '8px' }}>
          Creates an inner safety zone for critical content. You can configure your base image to fit within this safe area when uploading.
        </p>

        {doc.safe.enabled && (
          <div className="config-panel-content">
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ marginBottom: 0 }}>Safe Margin Size</label>
              <button
                className="btn btn-small btn-secondary"
                onClick={() => handleMarginLinkToggle('safe')}
              >
                {doc.safe.linked ? '🔗 Linked' : '🔓 Unlinked'}
              </button>
            </div>
          </div>

          {doc.safe.linked ? (
        <div className="form-group">
          <label>All Sides</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.safe.topPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleMarginChange('safe', 'topPts', parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
      ) : (
        <div className="form-row">
          <div className="form-group">
            <label>Top</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.safe.topPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('safe', 'topPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Right</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.safe.rightPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('safe', 'rightPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Bottom</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.safe.bottomPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('safe', 'bottomPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Left</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.safe.leftPts, doc.page.unitPreference).toFixed(2)}
              onChange={e => handleMarginChange('safe', 'leftPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
        </div>
      )}
          </div>
        )}
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="show-overlays"
          checked={doc.overlays.show}
          onChange={e =>
            onChange({
              overlays: { show: e.target.checked },
            })
          }
        />
        <label htmlFor="show-overlays">Show overlay guides & legend</label>
      </div>

      <div className="info-box" style={{ fontSize: '12px', background: '#e8f5e9', borderLeftColor: '#4caf50', marginTop: '16px' }}>
        <strong>📐 Dimensions Summary:</strong>
        <div style={{ marginTop: '6px' }}>
          <strong>Final Trimmed Size:</strong> {pointsToUnit(doc.page.widthPts, doc.page.unitPreference).toFixed(2)} × {pointsToUnit(doc.page.heightPts, doc.page.unitPreference).toFixed(2)} {doc.page.unitPreference}
        </div>
        {doc.bleed.enabled && (doc.bleed.leftPts > 0 || doc.bleed.topPts > 0 || doc.bleed.rightPts > 0 || doc.bleed.bottomPts > 0) && (
          <>
            <div style={{ marginTop: '4px' }}>
              <strong>Full Size with Bleed:</strong> {pointsToUnit(doc.page.widthPts + doc.bleed.leftPts + doc.bleed.rightPts, doc.page.unitPreference).toFixed(2)} × {pointsToUnit(doc.page.heightPts + doc.bleed.topPts + doc.bleed.bottomPts, doc.page.unitPreference).toFixed(2)} {doc.page.unitPreference}
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#2e7d32' }}>
              💡 Your artwork canvas is <strong>{pointsToUnit(doc.bleed.leftPts + doc.bleed.rightPts, doc.page.unitPreference).toFixed(2)} {doc.page.unitPreference} wider</strong> and <strong>{pointsToUnit(doc.bleed.topPts + doc.bleed.bottomPts, doc.page.unitPreference).toFixed(2)} {doc.page.unitPreference} taller</strong> than the final printed size to account for bleed area.
            </div>
          </>
        )}
      </div>

      <div className="info-box" style={{ fontSize: '11px', marginTop: '12px' }}>
        <strong>Understanding Margins:</strong>
        <div style={{ marginTop: '8px' }}>
          {doc.bleed.enabled && (
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#ff0000', fontWeight: 'bold' }}>■</span> <strong>Bleed:</strong> The red transparent overlay shows extra area outside the canvas that will be cut off. Extend background images and colors into this area to prevent white edges after cutting.
            </div>
          )}
          {doc.safe.enabled && (
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#0066ff', fontWeight: 'bold' }}>■</span> <strong>Margin Zone:</strong> The blue transparent overlay shows the area between the trim line and safe area. Some risk of loss exists here during cutting.
            </div>
          )}
          <div>
            <strong>Safe Area:</strong> The inner zone (no overlay) where all critical content (text, logos, QR codes) should be placed to ensure nothing important gets cut off.
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
