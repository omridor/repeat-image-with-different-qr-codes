import type { DocumentModel } from '../types';
import { pointsToUnit, unitToPoints } from '../utils/units';
import { CollapsibleCard } from './CollapsibleCard';

interface BaseImageSettingsProps {
  doc: DocumentModel;
  onChange: (updates: Partial<DocumentModel>) => void;
  onImageUpload: (file: File) => void;
  hasImage: boolean;
}

export function BaseImageSettings({ doc, onChange, onImageUpload, hasImage }: BaseImageSettingsProps) {
  const handleBaseImageChange = (key: string, value: any) => {
    onChange({
      baseImage: { ...doc.baseImage, [key]: value },
    });
  };

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const pts = unitToPoints(value, doc.page.unitPreference);
    onChange({
      baseImage: {
        ...doc.baseImage,
        extraPaddingPts: { ...doc.baseImage.extraPaddingPts, [side]: pts },
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      // Clear the input value to allow re-selection of the same file
      e.target.value = '';
    }
  };

  return (
    <CollapsibleCard title="Base Image" icon="🖼️" defaultExpanded={false}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Upload a template image that will appear on every page. This is your background design that will be repeated with different QR codes.
      </p>
      
      <div className="form-group">
        <label>Upload Template Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileUpload}
        />
        {hasImage && (
          <div style={{ fontSize: '11px', color: '#27ae60', marginTop: '4px' }}>
            ✓ Image is loaded (file input can't show saved files)
          </div>
        )}
      </div>

      {hasImage && (
        <div className="config-panel">
          <div className="form-group">
            <label>Placement Bounds</label>
            <select
              className="form-control"
              value={doc.baseImage.placementBounds}
              onChange={e => handleBaseImageChange('placementBounds', e.target.value)}
            >
              <option value="bleed-area">Full Bleed Area (entire page)</option>
              <option value="canvas">Canvas (inside trim line)</option>
              <option value="safe-area">Safe Area (inside margins)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fit Mode</label>
            <select
              className="form-control"
              value={doc.baseImage.fitMode}
              onChange={e => handleBaseImageChange('fitMode', e.target.value)}
            >
              <option value="contain">Contain (fit inside, maintain aspect)</option>
              <option value="cover">Cover (fill area, maintain aspect)</option>
              <option value="fill-width">Fill Width</option>
              <option value="fill-height">Fill Height</option>
              <option value="stretch">Stretch (ignore aspect ratio)</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="lock-aspect"
              checked={doc.baseImage.lockAspectRatio}
              onChange={e => handleBaseImageChange('lockAspectRatio', e.target.checked)}
            />
            <label htmlFor="lock-aspect">Lock aspect ratio</label>
          </div>

          <div className="form-group">
            <label>Rotation</label>
            <div className="radio-group">
              {[0, 90, 180, 270].map(deg => (
                <div key={deg} className="radio-item">
                  <input
                    type="radio"
                    id={`rotation-${deg}`}
                    checked={doc.baseImage.rotation === deg}
                    onChange={() => handleBaseImageChange('rotation', deg)}
                  />
                  <label htmlFor={`rotation-${deg}`}>{deg}°</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Offset Anchor</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="anchor-corner"
                  checked={doc.baseImage.offsetAnchor === 'corner'}
                  onChange={() => handleBaseImageChange('offsetAnchor', 'corner')}
                />
                <label htmlFor="anchor-corner">From Corner</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="anchor-center"
                  checked={doc.baseImage.offsetAnchor === 'center'}
                  onChange={() => handleBaseImageChange('offsetAnchor', 'center')}
                />
                <label htmlFor="anchor-center">From Center</label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Offset X</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.offsetXPts, doc.page.unitPreference).toFixed(2)}
                onChange={e => {
                  const pts = unitToPoints(parseFloat(e.target.value), doc.page.unitPreference);
                  handleBaseImageChange('offsetXPts', pts);
                }}
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Offset Y</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.offsetYPts, doc.page.unitPreference).toFixed(2)}
                onChange={e => {
                  const pts = unitToPoints(parseFloat(e.target.value), doc.page.unitPreference);
                  handleBaseImageChange('offsetYPts', pts);
                }}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Extra Padding (adds margin to image)</label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Top</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.extraPaddingPts.top, doc.page.unitPreference).toFixed(2)}
                onChange={e => handlePaddingChange('top', parseFloat(e.target.value))}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Right</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.extraPaddingPts.right, doc.page.unitPreference).toFixed(2)}
                onChange={e => handlePaddingChange('right', parseFloat(e.target.value))}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bottom</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.extraPaddingPts.bottom, doc.page.unitPreference).toFixed(2)}
                onChange={e => handlePaddingChange('bottom', parseFloat(e.target.value))}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Left</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.baseImage.extraPaddingPts.left, doc.page.unitPreference).toFixed(2)}
                onChange={e => handlePaddingChange('left', parseFloat(e.target.value))}
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
}
