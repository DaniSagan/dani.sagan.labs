export interface FormulaDocument { id: string; name: string; latex: string; updated: string; fontSize: number; foreground: string; background: string; transparent: boolean; scale: number; }
export const COOKIE_PREFIX = 'dsl_formula_v1_';
export const COOKIE_PATH = new URL(document.baseURI).pathname.replace(/\/$/, '') || '/';
export function readFormulaCookies(): FormulaDocument[] {
  const found: FormulaDocument[] = [];
  for (const cookie of document.cookie.split(';')) {
    const [key, ...value] = cookie.trim().split('=');
    if (!key.startsWith(COOKIE_PREFIX) || key.endsWith('active')) continue;
    try { const doc = JSON.parse(decodeURIComponent(value.join('='))); if (validDocument(doc)) found.push(doc); } catch { /* Ignore only corrupt formula cookies. */ }
  }
  return found.sort((a, b) => b.updated.localeCompare(a.updated));
}
export function validDocument(doc: unknown): doc is FormulaDocument {
  const d = doc as FormulaDocument;
  return !!d && typeof d.id === 'string' && /^[a-zA-Z0-9-]{1,60}$/.test(d.id) && typeof d.name === 'string' && d.name.length <= 80 && typeof d.latex === 'string' && d.latex.length <= 20000 && typeof d.updated === 'string' && Number.isFinite(d.fontSize) && d.fontSize >= 12 && d.fontSize <= 96 && Number.isFinite(d.scale) && d.scale >= 1 && d.scale <= 4 && /^#[a-f\d]{6}$/i.test(d.foreground) && /^#[a-f\d]{6}$/i.test(d.background) && typeof d.transparent === 'boolean';
}
export function saveFormulaCookie(doc: FormulaDocument): void {
  const key = COOKIE_PREFIX + doc.id, value = encodeURIComponent(JSON.stringify(doc));
  // Browsers commonly cap an individual cookie at 4096 bytes. Never claim a truncated save succeeded.
  if (key.length + value.length > 3800) throw new Error('Esta fórmula supera el tamaño de una cookie. Descarga JSON para conservarla completa.');
  const otherBytes = document.cookie.split(';').map(c => c.trim()).filter(c => c.startsWith(COOKIE_PREFIX) && !c.startsWith(key + '=')).reduce((sum, c) => sum + c.length + 2, 0);
  if (otherBytes + key.length + value.length > 7000) throw new Error('La biblioteca ha alcanzado su capacidad de cookies. Descarga JSON o elimina otra fórmula.');
  if (!document.cookie.includes(key + '=') && readFormulaCookies().length >= 16) throw new Error('La biblioteca admite 16 fórmulas. Descarga y elimina alguna para guardar otra.');
  document.cookie = `${key}=${value}; Max-Age=31536000; Path=${COOKIE_PATH}; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`;
  if (!document.cookie.split(';').some(c => c.trim() === `${key}=${value}`)) throw new Error('El navegador ha bloqueado las cookies. Descarga JSON para conservar tu fórmula.');
  document.cookie = `${COOKIE_PREFIX}active=${doc.id}; Max-Age=31536000; Path=${COOKIE_PATH}; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`;
}
export function deleteFormulaCookie(id: string): void { document.cookie = `${COOKIE_PREFIX}${id}=; Max-Age=0; Path=${COOKIE_PATH}; SameSite=Strict`; }
