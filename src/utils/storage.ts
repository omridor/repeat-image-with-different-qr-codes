import { get, set, del, keys } from 'idb-keyval';
import type { TemplateBundle, TemplateMeta, DocumentModel } from '../types';

// Storage keys
const STORAGE_KEYS = {
  TEMPLATES_INDEX: 'templatesIndex',
  TEMPLATE_PREFIX: 'template:',
  LAST_SELECTED_TEMPLATE: 'lastSelectedTemplateId',
  WORKING_DRAFT: 'workingDraft',
  BASE_IMAGE: 'baseImage',
  QR_LOGO: 'qrLogo',
};

// Templates Index (list of metadata)
export async function getTemplatesIndex(): Promise<TemplateMeta[]> {
  const index = await get<TemplateMeta[]>(STORAGE_KEYS.TEMPLATES_INDEX);
  return index || [];
}

export async function saveTemplatesIndex(index: TemplateMeta[]): Promise<void> {
  await set(STORAGE_KEYS.TEMPLATES_INDEX, index);
}

// Individual template
export async function getTemplate(id: string): Promise<TemplateBundle | null> {
  const template = await get<TemplateBundle>(`${STORAGE_KEYS.TEMPLATE_PREFIX}${id}`);
  return template || null;
}

export async function saveTemplate(bundle: TemplateBundle): Promise<void> {
  // Save the full template
  await set(`${STORAGE_KEYS.TEMPLATE_PREFIX}${bundle.meta.id}`, bundle);
  
  // Update the index
  const index = await getTemplatesIndex();
  const existingIndex = index.findIndex(t => t.id === bundle.meta.id);
  
  if (existingIndex >= 0) {
    index[existingIndex] = bundle.meta;
  } else {
    index.push(bundle.meta);
  }
  
  await saveTemplatesIndex(index);
}

export async function deleteTemplate(id: string): Promise<void> {
  // Delete the template
  await del(`${STORAGE_KEYS.TEMPLATE_PREFIX}${id}`);
  
  // Update the index
  const index = await getTemplatesIndex();
  const filtered = index.filter(t => t.id !== id);
  await saveTemplatesIndex(filtered);
}

// Last selected template
export async function getLastSelectedTemplateId(): Promise<string | null> {
  return await get<string>(STORAGE_KEYS.LAST_SELECTED_TEMPLATE) || null;
}

export async function saveLastSelectedTemplateId(id: string): Promise<void> {
  await set(STORAGE_KEYS.LAST_SELECTED_TEMPLATE, id);
}

// Working draft (auto-save)
export async function getWorkingDraft(): Promise<DocumentModel | null> {
  return await get<DocumentModel>(STORAGE_KEYS.WORKING_DRAFT) || null;
}

export async function saveWorkingDraft(doc: DocumentModel): Promise<void> {
  await set(STORAGE_KEYS.WORKING_DRAFT, doc);
}

export async function clearWorkingDraft(): Promise<void> {
  await del(STORAGE_KEYS.WORKING_DRAFT);
}

// Current session assets (not in template)
export async function getBaseImage(): Promise<Blob | null> {
  return await get<Blob>(STORAGE_KEYS.BASE_IMAGE) || null;
}

export async function saveBaseImage(blob: Blob): Promise<void> {
  await set(STORAGE_KEYS.BASE_IMAGE, blob);
}

export async function clearBaseImage(): Promise<void> {
  await del(STORAGE_KEYS.BASE_IMAGE);
}

export async function getQRLogo(): Promise<Blob | null> {
  return await get<Blob>(STORAGE_KEYS.QR_LOGO) || null;
}

export async function saveQRLogo(blob: Blob): Promise<void> {
  await set(STORAGE_KEYS.QR_LOGO, blob);
}

export async function clearQRLogo(): Promise<void> {
  await del(STORAGE_KEYS.QR_LOGO);
}

// Clear all storage (for debugging)
export async function clearAllStorage(): Promise<void> {
  const allKeys = await keys();
  await Promise.all(allKeys.map(key => del(key)));
}
