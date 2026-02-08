import type { DocumentModel } from '../types';
import { pointsToUnit, unitToPoints } from '../utils/units';
import { CollapsibleCard } from './CollapsibleCard';

interface LabelSettingsProps {
  doc: DocumentModel;
  onChange: (updates: Partial<DocumentModel>) => void;
}

export function LabelSettings({ doc, onChange }: LabelSettingsProps) {
  const handleLabelChange = (key: string, value: any) => {
    onChange({
      label: { ...doc.label, [key]: value },
    });
  };

  const handleFontChange = (key: string, value: any) => {
    onChange({
      label: {
        ...doc.label,
        font: { ...doc.label.font, [key]: value },
      },
    });
  };

  const handleBoxChange = (key: string, value: any) => {
    onChange({
      label: {
        ...doc.label,
        box: { ...doc.label.box, [key]: value },
      },
    });
  };

  const handleOutlineChange = (key: string, value: any) => {
    onChange({
      label: {
        ...doc.label,
        outline: { ...doc.label.outline, [key]: value },
      },
    });
  };

  const handleWrapChange = (key: string, value: any) => {
    onChange({
      label: {
        ...doc.label,
        wrap: { ...doc.label.wrap, [key]: value },
      },
    });
  };

  return (
    <CollapsibleCard title="Label Settings" icon="🏷️" defaultExpanded={false}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        Add text labels below or around your QR codes. Customize the font, color, and positioning to match your design.
      </p>
      
      <div className="config-panel">
        <div className="config-panel-header">
          <input
            type="checkbox"
            id="label-enabled"
            checked={doc.label.enabled}
            onChange={e => handleLabelChange('enabled', e.target.checked)}
          />
          <label htmlFor="label-enabled">Add text labels</label>
        </div>

        {doc.label.enabled && (
          <div className="config-panel-content">
          <div className="form-group">
            <label>Orientation</label>
            <select
              className="form-control"
              value={doc.label.orientation}
              onChange={e => handleLabelChange('orientation', e.target.value)}
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gap</label>
            <input
              type="number"
              className="form-control"
              value={pointsToUnit(doc.label.gapPts, doc.page.unitPreference).toFixed(2)}
              onChange={e =>
                handleLabelChange('gapPts', unitToPoints(parseFloat(e.target.value), doc.page.unitPreference))
              }
              step="0.01"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Offset X</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.label.offsetXPts, doc.page.unitPreference).toFixed(2)}
                onChange={e =>
                  handleLabelChange('offsetXPts', unitToPoints(parseFloat(e.target.value), doc.page.unitPreference))
                }
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Offset Y</label>
              <input
                type="number"
                className="form-control"
                value={pointsToUnit(doc.label.offsetYPts, doc.page.unitPreference).toFixed(2)}
                onChange={e =>
                  handleLabelChange('offsetYPts', unitToPoints(parseFloat(e.target.value), doc.page.unitPreference))
                }
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Text Box Width</label>
            <select
              className="form-control"
              value={doc.label.textBoxWidthMode}
              onChange={e => handleLabelChange('textBoxWidthMode', e.target.value)}
            >
              <option value="auto">Auto (match QR)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {doc.label.textBoxWidthMode === 'custom' && (
            <div className="form-group">
              <label>Custom Width</label>
              <input
                type="number"
                className="form-control"
                value={
                  doc.label.textBoxWidthPts
                    ? pointsToUnit(doc.label.textBoxWidthPts, doc.page.unitPreference).toFixed(2)
                    : ''
                }
                onChange={e =>
                  handleLabelChange(
                    'textBoxWidthPts',
                    unitToPoints(parseFloat(e.target.value), doc.page.unitPreference)
                  )
                }
                step="0.01"
              />
            </div>
          )}

          <div className="form-group">
            <label>Alignment</label>
            <select
              className="form-control"
              value={doc.label.align}
              onChange={e => handleLabelChange('align', e.target.value)}
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rotate-with-group"
              checked={doc.label.rotateWithGroup}
              onChange={e => handleLabelChange('rotateWithGroup', e.target.checked)}
            />
            <label htmlFor="rotate-with-group">Rotate with QR group</label>
          </div>

          <div className="config-panel">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2c3e50', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #dee2e6' }}>
              Font
            </div>
            <div className="form-group">
            <label>Family</label>
            <select
              className="form-control"
              value={doc.label.font.family}
              onChange={e => handleFontChange('family', e.target.value)}
            >
              <option value="Helvetica">Helvetica</option>
              <option value="TimesRoman">Times Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </div>

          <div className="form-group">
            <label>Size (pts)</label>
            <input
              type="number"
              className="form-control"
              value={doc.label.font.sizePts}
              onChange={e => handleFontChange('sizePts', parseFloat(e.target.value))}
              step="0.5"
              min="6"
            />
          </div>

          <div className="form-group">
            <label>Weight</label>
            <select
              className="form-control"
              value={doc.label.font.weight}
              onChange={e => handleFontChange('weight', e.target.value)}
            >
              <option value="regular">Regular</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={doc.label.font.color}
                onChange={e => handleFontChange('color', e.target.value)}
              />
              <input
                type="text"
                className="form-control color-text"
                value={doc.label.font.color}
                onChange={e => handleFontChange('color', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Line Height</label>
            <input
              type="number"
              className="form-control"
              value={doc.label.font.lineHeight}
              onChange={e => handleFontChange('lineHeight', parseFloat(e.target.value))}
              step="0.1"
              min="0.8"
              max="3"
            />
          </div>

          <div className="form-group">
            <label>Letter Spacing (pts)</label>
            <input
              type="number"
              className="form-control"
              value={doc.label.font.letterSpacingPts}
              onChange={e => handleFontChange('letterSpacingPts', parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
          </div>

          <div className="config-panel">
            <div className="config-panel-header">
              <input
                type="checkbox"
                id="box-enabled"
                checked={doc.label.box.enabled}
                onChange={e => handleBoxChange('enabled', e.target.checked)}
              />
              <label htmlFor="box-enabled">Background Box</label>
            </div>

          {doc.label.box.enabled && (
            <>
              <div className="form-group">
                <label>Box Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={doc.label.box.color}
                    onChange={e => handleBoxChange('color', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control color-text"
                    value={doc.label.box.color}
                    onChange={e => handleBoxChange('color', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Padding (pts)</label>
                <input
                  type="number"
                  className="form-control"
                  value={doc.label.box.paddingPts}
                  onChange={e => handleBoxChange('paddingPts', parseFloat(e.target.value))}
                  step="0.5"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Border Radius (pts)</label>
                <input
                  type="number"
                  className="form-control"
                  value={doc.label.box.radiusPts}
                  onChange={e => handleBoxChange('radiusPts', parseFloat(e.target.value))}
                  step="0.5"
                  min="0"
                />
              </div>
            </>
          )}
          </div>

          <div className="config-panel">
            <div className="config-panel-header">
              <input
                type="checkbox"
                id="outline-enabled"
                checked={doc.label.outline.enabled}
                onChange={e => handleOutlineChange('enabled', e.target.checked)}
              />
              <label htmlFor="outline-enabled">Text Outline</label>
            </div>

          {doc.label.outline.enabled && (
            <>
              <div className="form-group">
                <label>Outline Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={doc.label.outline.color}
                    onChange={e => handleOutlineChange('color', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control color-text"
                    value={doc.label.outline.color}
                    onChange={e => handleOutlineChange('color', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Outline Width (pts)</label>
                <input
                  type="number"
                  className="form-control"
                  value={doc.label.outline.widthPts}
                  onChange={e => handleOutlineChange('widthPts', parseFloat(e.target.value))}
                  step="0.5"
                  min="0.5"
                />
              </div>
            </>
          )}
          </div>

          <div className="config-panel">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2c3e50', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #dee2e6' }}>
              Text Wrapping
            </div>
            <div className="form-group">
            <label>Wrap Mode</label>
            <select
              className="form-control"
              value={doc.label.wrap.mode}
              onChange={e => handleWrapChange('mode', e.target.value)}
            >
              <option value="word">Word</option>
              <option value="char">Character</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Lines</label>
            <input
              type="number"
              className="form-control"
              value={doc.label.wrap.maxLines}
              onChange={e => handleWrapChange('maxLines', parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="ellipsis"
              checked={doc.label.wrap.ellipsis}
              onChange={e => handleWrapChange('ellipsis', e.target.checked)}
            />
            <label htmlFor="ellipsis">Add ellipsis (...) when truncated</label>
          </div>
          </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}
