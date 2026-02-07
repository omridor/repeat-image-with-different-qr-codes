// Core types for QR PDF Card Maker

export type UnitPreference = 'cm' | 'in' | 'mm';
export type FitMode = 'contain' | 'cover' | 'stretch' | 'fill-width' | 'fill-height';
export type PlacementBounds = 'canvas' | 'safe-area' | 'bleed-area';
export type OffsetAnchor = 'corner' | 'center';
export type Rotation = 0 | 90 | 180 | 270;
export type Anchor = 'tl' | 'tr' | 'bl' | 'br' | 'center';
export type Pattern = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerStyle = 'dot' | 'square' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type ECC = 'L' | 'M' | 'Q' | 'H';
export type LabelOrientation = 'bottom' | 'top' | 'left' | 'right';
export type TextBoxWidthMode = 'auto' | 'custom';
export type Alignment = 'start' | 'center' | 'end';
export type FontFamily = 'Helvetica' | 'TimesRoman' | 'Courier' | 'Custom';
export type FontWeight = 'regular' | 'bold';
export type WrapMode = 'word' | 'char' | 'none';
export type DataMode = 'urls' | 'csv';
export type DeriveMethod = 'lastPathSegment' | 'regex';

export interface PageConfig {
  widthPts: number;
  heightPts: number;
  unitPreference: UnitPreference;
  presetId: string;
}

export interface MarginConfig {
  enabled: boolean;
  topPts: number;
  rightPts: number;
  bottomPts: number;
  leftPts: number;
  linked: boolean;
}

export interface OverlaysConfig {
  show: boolean;
}

export interface ExtraPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BaseImageConfig {
  rotation: Rotation;
  fitMode: FitMode;
  placementBounds: PlacementBounds;
  lockAspectRatio: boolean;
  offsetAnchor: OffsetAnchor;
  offsetXPts: number;
  offsetYPts: number;
  extraPaddingPts: ExtraPadding;
}

export interface QRStyle {
  pattern: Pattern;
  corners: CornerStyle;
  ecc: ECC;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  quietZonePts: number;
}

export interface QRLogo {
  enabled: boolean;
  sizePct: number;
  backingEnabled: boolean;
  backingColor: string;
  backingRadiusPts: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface QRConfig {
  sizePts: number;
  canvasAnchor: Anchor; // Which point on the canvas to anchor to
  qrAnchor: Anchor; // Which point on the QR aligns to the canvas anchor
  offsetXPts: number; // X offset from the anchor point
  offsetYPts: number; // Y offset from the anchor point
  snapToSafe: boolean;
  rotation: Rotation;
  style: QRStyle;
  logo: QRLogo;
}

export interface LabelFont {
  family: FontFamily;
  customFontAssetId?: string;
  sizePts: number;
  weight: FontWeight;
  color: string;
  lineHeight: number;
  letterSpacingPts: number;
}

export interface LabelBox {
  enabled: boolean;
  color: string;
  paddingPts: number;
  radiusPts: number;
}

export interface LabelOutline {
  enabled: boolean;
  color: string;
  widthPts: number;
}

export interface LabelWrap {
  mode: WrapMode;
  maxLines: number;
  ellipsis: boolean;
}

export interface LabelConfig {
  enabled: boolean;
  orientation: LabelOrientation;
  gapPts: number;
  offsetXPts: number;
  offsetYPts: number;
  textBoxWidthMode: TextBoxWidthMode;
  textBoxWidthPts?: number;
  align: Alignment;
  rotateWithGroup: boolean;
  font: LabelFont;
  box: LabelBox;
  outline: LabelOutline;
  wrap: LabelWrap;
}

export interface CSVConfig {
  payloadColumn: string;
  labelColumn: string;
  labelTemplate: string;
  allowNonHttpSchemes: boolean;
}

export interface DeriveConfig {
  enabled: boolean;
  method: DeriveMethod;
  regex?: string;
}

export interface DataConfig {
  mode: DataMode;
  urlsText: string;
  csvText: string;
  csvConfig: CSVConfig;
  derive: DeriveConfig;
}

export interface DocumentModel {
  page: PageConfig;
  bleed: MarginConfig;
  safe: MarginConfig;
  overlays: OverlaysConfig;
  baseImage: BaseImageConfig;
  qr: QRConfig;
  label: LabelConfig;
  data: DataConfig;
}

// Template types
export interface TemplateMeta {
  id: string;
  name: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  thumbnailPngDataUrl?: string;
}

export interface TemplateAssets {
  baseImageBlob?: Blob;
  baseImageMimeType?: string;
  baseImageFilename?: string;
  qrLogoBlob?: Blob;
  qrLogoMimeType?: string;
  qrLogoFilename?: string;
  customFontBlob?: Blob;
  customFontFilename?: string;
}

export interface TemplateBundle {
  schemaVersion: number;
  meta: TemplateMeta;
  docModel: DocumentModel;
  assets: TemplateAssets;
  storeCsvData: boolean;
}

// Page size presets
export interface PagePreset {
  id: string;
  name: string;
  widthPts: number;
  heightPts: number;
}

// Data row for processing
export interface DataRow {
  payload: string;
  label: string;
  index: number;
  errors: string[];
  rawData?: Record<string, string>;
}
