import type { DocumentModel, PagePreset } from './types';

// Points per unit conversions
export const POINTS_PER_INCH = 72;
export const POINTS_PER_CM = POINTS_PER_INCH / 2.54;
export const POINTS_PER_MM = POINTS_PER_CM / 10;

// Page size presets
export const PAGE_PRESETS: PagePreset[] = [
  // Business Cards
  {
    id: 'business-us',
    name: 'Business Card (US) - 3.5" × 2"',
    widthPts: 3.5 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'business-eu',
    name: 'Business Card (EU) - 85mm × 55mm',
    widthPts: 85 * POINTS_PER_MM,
    heightPts: 55 * POINTS_PER_MM,
  },
  {
    id: 'business-square',
    name: 'Business Card (Square) - 2.5" × 2.5"',
    widthPts: 2.5 * POINTS_PER_INCH,
    heightPts: 2.5 * POINTS_PER_INCH,
  },
  
  // Labels & Stickers
  {
    id: 'label-square-2',
    name: 'Square Label - 2" × 2"',
    widthPts: 2 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'label-square-3',
    name: 'Square Label - 3" × 3"',
    widthPts: 3 * POINTS_PER_INCH,
    heightPts: 3 * POINTS_PER_INCH,
  },
  {
    id: 'label-round-2',
    name: 'Round Label - 2" diameter',
    widthPts: 2 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'label-rect-4x2',
    name: 'Rectangle Label - 4" × 2"',
    widthPts: 4 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'label-avery-5160',
    name: 'Avery 5160 Label - 2.625" × 1"',
    widthPts: 2.625 * POINTS_PER_INCH,
    heightPts: 1 * POINTS_PER_INCH,
  },
  {
    id: 'label-avery-5163',
    name: 'Avery 5163 Label - 4" × 2"',
    widthPts: 4 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'label-avery-22806',
    name: 'Avery 22806 Square - 2.5" × 2.5"',
    widthPts: 2.5 * POINTS_PER_INCH,
    heightPts: 2.5 * POINTS_PER_INCH,
  },
  
  // Name Badges
  {
    id: 'badge-3x4',
    name: 'Name Badge - 3" × 4"',
    widthPts: 3 * POINTS_PER_INCH,
    heightPts: 4 * POINTS_PER_INCH,
  },
  {
    id: 'badge-4x3',
    name: 'Name Badge (Landscape) - 4" × 3"',
    widthPts: 4 * POINTS_PER_INCH,
    heightPts: 3 * POINTS_PER_INCH,
  },
  
  // Playing Cards
  {
    id: 'playing-poker',
    name: 'Playing Card (Poker) - 2.5" × 3.5"',
    widthPts: 2.5 * POINTS_PER_INCH,
    heightPts: 3.5 * POINTS_PER_INCH,
  },
  {
    id: 'playing-bridge',
    name: 'Playing Card (Bridge) - 2.25" × 3.5"',
    widthPts: 2.25 * POINTS_PER_INCH,
    heightPts: 3.5 * POINTS_PER_INCH,
  },
  {
    id: 'playing-tarot',
    name: 'Tarot Card - 2.75" × 4.75"',
    widthPts: 2.75 * POINTS_PER_INCH,
    heightPts: 4.75 * POINTS_PER_INCH,
  },
  
  // Gift Tags
  {
    id: 'gift-tag-small',
    name: 'Gift Tag (Small) - 2" × 3.5"',
    widthPts: 2 * POINTS_PER_INCH,
    heightPts: 3.5 * POINTS_PER_INCH,
  },
  {
    id: 'gift-tag-large',
    name: 'Gift Tag (Large) - 2.5" × 4"',
    widthPts: 2.5 * POINTS_PER_INCH,
    heightPts: 4 * POINTS_PER_INCH,
  },
  
  // Postcards
  {
    id: 'postcard-us',
    name: 'Postcard (US) - 6" × 4"',
    widthPts: 6 * POINTS_PER_INCH,
    heightPts: 4 * POINTS_PER_INCH,
  },
  {
    id: 'postcard-a6',
    name: 'Postcard (A6) - 148mm × 105mm',
    widthPts: 148 * POINTS_PER_MM,
    heightPts: 105 * POINTS_PER_MM,
  },
  
  // Event Tickets
  {
    id: 'ticket-standard',
    name: 'Event Ticket - 5.5" × 2"',
    widthPts: 5.5 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  {
    id: 'ticket-wide',
    name: 'Event Ticket (Wide) - 7" × 2"',
    widthPts: 7 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
  
  // Bookmarks
  {
    id: 'bookmark',
    name: 'Bookmark - 2" × 6"',
    widthPts: 2 * POINTS_PER_INCH,
    heightPts: 6 * POINTS_PER_INCH,
  },
  
  // Luggage Tags
  {
    id: 'luggage-tag',
    name: 'Luggage Tag - 2.75" × 4.25"',
    widthPts: 2.75 * POINTS_PER_INCH,
    heightPts: 4.25 * POINTS_PER_INCH,
  },
  
  // Hang Tags
  {
    id: 'hang-tag-small',
    name: 'Hang Tag (Small) - 2" × 3"',
    widthPts: 2 * POINTS_PER_INCH,
    heightPts: 3 * POINTS_PER_INCH,
  },
  {
    id: 'hang-tag-large',
    name: 'Hang Tag (Large) - 3" × 5"',
    widthPts: 3 * POINTS_PER_INCH,
    heightPts: 5 * POINTS_PER_INCH,
  },
  
  // Wine/Bottle Labels
  {
    id: 'wine-label',
    name: 'Wine Label - 4" × 3"',
    widthPts: 4 * POINTS_PER_INCH,
    heightPts: 3 * POINTS_PER_INCH,
  },
  {
    id: 'bottle-label-wrap',
    name: 'Bottle Label (Wrap) - 8" × 3"',
    widthPts: 8 * POINTS_PER_INCH,
    heightPts: 3 * POINTS_PER_INCH,
  },
  
  // CD/DVD Labels
  {
    id: 'cd-label',
    name: 'CD/DVD Label - 4.65" diameter',
    widthPts: 4.65 * POINTS_PER_INCH,
    heightPts: 4.65 * POINTS_PER_INCH,
  },
  
  // Custom
  {
    id: 'custom',
    name: 'Custom Size',
    widthPts: 3.5 * POINTS_PER_INCH,
    heightPts: 2 * POINTS_PER_INCH,
  },
];

// Default document model
export const DEFAULT_DOCUMENT_MODEL: DocumentModel = {
  page: {
    widthPts: PAGE_PRESETS[0].widthPts,
    heightPts: PAGE_PRESETS[0].heightPts,
    unitPreference: 'cm',
    presetId: PAGE_PRESETS[0].id,
  },
  bleed: {
    enabled: true,
    topPts: 0.3 * POINTS_PER_CM,
    rightPts: 0.3 * POINTS_PER_CM,
    bottomPts: 0.3 * POINTS_PER_CM,
    leftPts: 0.3 * POINTS_PER_CM,
    linked: true,
  },
  safe: {
    enabled: true,
    topPts: 0.5 * POINTS_PER_CM,
    rightPts: 0.5 * POINTS_PER_CM,
    bottomPts: 0.5 * POINTS_PER_CM,
    leftPts: 0.5 * POINTS_PER_CM,
    linked: true,
  },
  overlays: {
    show: true,
  },
  baseImage: {
    rotation: 0,
    fitMode: 'contain',
    placementBounds: 'canvas',
    lockAspectRatio: true,
    offsetAnchor: 'center',
    offsetXPts: 0,
    offsetYPts: 0,
    extraPaddingPts: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  qr: {
    sizePts: 1 * POINTS_PER_INCH,
    canvasAnchor: 'center', // Center of canvas
    qrAnchor: 'center', // Center of QR
    offsetXPts: 0, // No offset
    offsetYPts: 0, // No offset
    snapToSafe: false,
    rotation: 0,
    style: {
      pattern: 'square',
      corners: 'square',
      ecc: 'M',
      fgColor: '#000000',
      bgColor: '#ffffff',
      transparentBg: false,
      quietZonePts: 4,
    },
    logo: {
      enabled: false,
      sizePct: 30,
      backingEnabled: true,
      backingColor: '#ffffff',
      backingRadiusPts: 4,
    },
  },
  label: {
    enabled: true,
    orientation: 'bottom',
    gapPts: 8,
    offsetXPts: 0,
    offsetYPts: 0,
    textBoxWidthMode: 'auto',
    align: 'center',
    rotateWithGroup: false,
    font: {
      family: 'Helvetica',
      sizePts: 10,
      weight: 'regular',
      color: '#000000',
      lineHeight: 1.2,
      letterSpacingPts: 0,
    },
    box: {
      enabled: false,
      color: '#ffffff',
      paddingPts: 4,
      radiusPts: 0,
    },
    outline: {
      enabled: false,
      color: '#ffffff',
      widthPts: 1,
    },
    wrap: {
      mode: 'word',
      maxLines: 3,
      ellipsis: true,
    },
  },
  data: {
    mode: 'urls',
    urlsText: '',
    csvText: '',
    csvConfig: {
      payloadColumn: 'url',
      labelColumn: 'label',
      labelTemplate: '{label}',
      allowNonHttpSchemes: false,
    },
    derive: {
      enabled: false,
      method: 'lastPathSegment',
    },
  },
};
