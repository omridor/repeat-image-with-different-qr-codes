import type { DocumentModel, Anchor } from '../types';
import { pointsToUnit, unitToPoints } from '../utils/units';
import { CollapsibleCard } from './CollapsibleCard';

interface QRSettingsProps {
  doc: DocumentModel;
  onChange: (updates: Partial<DocumentModel>) => void;
  onLogoUpload: (file: File) => void;
  hasLogo: boolean;
}

export function QRSettings({ doc, onChange, onLogoUpload, hasLogo }: QRSettingsProps) {
  const handleQRChange = (key: string, value: any) => {
    onChange({
      qr: { ...doc.qr, [key]: value },
    });
  };

  const handleStyleChange = (key: string, value: any) => {
    onChange({
      qr: {
        ...doc.qr,
        style: { ...doc.qr.style, [key]: value },
      },
    });
  };

  const handleLogoChange = (key: string, value: any) => {
    onChange({
      qr: {
        ...doc.qr,
        logo: { ...doc.qr.logo, [key]: value },
      },
    });
  };

  const handleOffsetChange = (key: 'offsetXPts' | 'offsetYPts', value: number) => {
    const pts = unitToPoints(value, doc.page.unitPreference);
    handleQRChange(key, pts);
  };

  const handleCanvasAnchorChange = (anchor: Anchor) => {
    handleQRChange('canvasAnchor', anchor);
  };
  
  const handleQRAnchorChange = (anchor: Anchor) => {
    handleQRChange('qrAnchor', anchor);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoUpload(file);
      handleLogoChange('enabled', true);
      // Clear the input value to allow re-selection of the same file
      e.target.value = '';
    }
  };

  return (
    <CollapsibleCard title="QR Code Settings" icon="📱" defaultExpanded={true}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Customize the appearance, size, and position of the QR codes on each page. You can also add a logo inside the QR code.
      </p>
      
      {/* Size & Position Panel */}
      <div className="config-panel">
        <div className="form-group">
          <label>Size</label>
        <input
          type="number"
          className="form-control"
          value={pointsToUnit(doc.qr.sizePts, doc.page.unitPreference).toFixed(2)}
          onChange={e =>
            handleQRChange('sizePts', unitToPoints(parseFloat(e.target.value), doc.page.unitPreference))
          }
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label>Canvas Anchor (where on page)</label>
        <div className="anchor-selector">
          {(['tl', 'tr', 'bl', 'br'] as const).map((anchor, idx) => {
            const positions = [0, 2, 6, 8]; // Grid positions for corners
            const gridPosition = positions[idx];
            return (
              <button
                key={anchor}
                className={`anchor-btn ${doc.qr.canvasAnchor === anchor ? 'active' : ''}`}
                onClick={() => handleCanvasAnchorChange(anchor)}
                style={{ gridColumn: (gridPosition % 3) + 1, gridRow: Math.floor(gridPosition / 3) + 1 }}
                title={anchor.toUpperCase()}
              >
                {anchor.toUpperCase()}
              </button>
            );
          })}
          <button
            className={`anchor-btn ${doc.qr.canvasAnchor === 'center' ? 'active' : ''}`}
            onClick={() => handleCanvasAnchorChange('center')}
            style={{ gridColumn: 2, gridRow: 2 }}
            title="CENTER"
          >
            C
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>QR Anchor (which part of QR)</label>
        <div className="anchor-selector">
          {(['tl', 'tr', 'bl', 'br'] as const).map((anchor, idx) => {
            const positions = [0, 2, 6, 8]; // Grid positions for corners
            const gridPosition = positions[idx];
            return (
              <button
                key={anchor}
                className={`anchor-btn ${doc.qr.qrAnchor === anchor ? 'active' : ''}`}
                onClick={() => handleQRAnchorChange(anchor)}
                style={{ gridColumn: (gridPosition % 3) + 1, gridRow: Math.floor(gridPosition / 3) + 1 }}
                title={anchor.toUpperCase()}
              >
                {anchor.toUpperCase()}
              </button>
            );
          })}
          <button
            className={`anchor-btn ${doc.qr.qrAnchor === 'center' ? 'active' : ''}`}
            onClick={() => handleQRAnchorChange('center')}
            style={{ gridColumn: 2, gridRow: 2 }}
            title="CENTER"
          >
            C
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Offset X ({doc.page.unitPreference})</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.qr.offsetXPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleOffsetChange('offsetXPts', parseFloat(e.target.value))}
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Offset Y ({doc.page.unitPreference})</label>
          <input
            type="number"
            className="form-control"
            value={pointsToUnit(doc.qr.offsetYPts, doc.page.unitPreference).toFixed(2)}
            onChange={e => handleOffsetChange('offsetYPts', parseFloat(e.target.value))}
            step="0.01"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Rotation</label>
        <div className="radio-group">
          {[0, 90, 180, 270].map(deg => (
            <div key={deg} className="radio-item">
              <input
                type="radio"
                id={`qr-rotation-${deg}`}
                checked={doc.qr.rotation === deg}
                onChange={() => handleQRChange('rotation', deg)}
              />
              <label htmlFor={`qr-rotation-${deg}`}>{deg}°</label>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Style Panel */}
      <div className="config-panel">
        <div className="form-group">
          <label>Pattern</label>
        <select
          className="form-control"
          value={doc.qr.style.pattern}
          onChange={e => handleStyleChange('pattern', e.target.value)}
        >
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>

      <div className="form-group">
        <label>Corners</label>
        <select
          className="form-control"
          value={doc.qr.style.corners}
          onChange={e => handleStyleChange('corners', e.target.value)}
        >
          <option value="square">Square</option>
          <option value="dot">Dot</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>

      <div className="form-group">
        <label>Error Correction</label>
        <select
          className="form-control"
          value={doc.qr.style.ecc}
          onChange={e => handleStyleChange('ecc', e.target.value)}
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Foreground Color</label>
        <div className="color-input-group">
          <input
            type="color"
            value={doc.qr.style.fgColor}
            onChange={e => handleStyleChange('fgColor', e.target.value)}
          />
          <input
            type="text"
            className="form-control color-text"
            value={doc.qr.style.fgColor}
            onChange={e => handleStyleChange('fgColor', e.target.value)}
          />
        </div>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="transparent-bg"
          checked={doc.qr.style.transparentBg}
          onChange={e => handleStyleChange('transparentBg', e.target.checked)}
        />
        <label htmlFor="transparent-bg">Transparent background</label>
      </div>

      {!doc.qr.style.transparentBg && (
        <div className="form-group">
          <label>Background Color</label>
          <div className="color-input-group">
            <input
              type="color"
              value={doc.qr.style.bgColor}
              onChange={e => handleStyleChange('bgColor', e.target.value)}
            />
            <input
              type="text"
              className="form-control color-text"
              value={doc.qr.style.bgColor}
              onChange={e => handleStyleChange('bgColor', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Quiet Zone</label>
        <input
          type="number"
          className="form-control"
          value={doc.qr.style.quietZonePts}
          onChange={e => handleStyleChange('quietZonePts', parseInt(e.target.value))}
          min="0"
        />
      </div>
      </div>

      {/* Logo Panel */}
      <div className="config-panel">
        <div className="config-panel-header">
          <input
            type="checkbox"
            id="logo-enabled"
            checked={doc.qr.logo.enabled}
            onChange={e => handleLogoChange('enabled', e.target.checked)}
          />
          <label htmlFor="logo-enabled">Place logo inside QR code</label>
        </div>

        {doc.qr.logo.enabled && (
          <div className="config-panel-content">
            <div className="form-group">
              <label>Upload Logo Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileUpload}
              />
              {hasLogo && (
                <div style={{ fontSize: '11px', color: '#27ae60', marginTop: '4px' }}>
                  ✓ Logo uploaded
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                <strong>Tip:</strong> Use PNG with transparent background at 512×512px or larger for best quality
              </div>
            </div>

            <div className="form-group">
              <label>Logo Size (%)</label>
              <input
                type="number"
                className="form-control"
                value={doc.qr.logo.sizePct}
                onChange={e => handleLogoChange('sizePct', parseFloat(e.target.value))}
                min="5"
                max="50"
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="backing-enabled"
                checked={doc.qr.logo.backingEnabled}
                onChange={e => handleLogoChange('backingEnabled', e.target.checked)}
              />
              <label htmlFor="backing-enabled">Add solid background behind logo</label>
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '-8px', marginBottom: '8px' }}>
              Helpful if your logo has transparency
            </div>

            {doc.qr.logo.backingEnabled && (
              <>
                <div className="form-group">
                  <label>Logo Background Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={doc.qr.logo.backingColor}
                      onChange={e => handleLogoChange('backingColor', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control color-text"
                      value={doc.qr.logo.backingColor}
                      onChange={e => handleLogoChange('backingColor', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Logo Background Corner Radius (pts)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={doc.qr.logo.backingRadiusPts}
                    onChange={e => handleLogoChange('backingRadiusPts', parseInt(e.target.value))}
                    min="0"
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    Creates rounded corners for the logo background
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}
