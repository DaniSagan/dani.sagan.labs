import { CadDocument, FurnitureDefinition } from './cad-model';
import { parseDocument, validateDefinition } from './cad-document';
export const CAD_DB = 'dsl-interior-cad';
/** Resolve writes only on transaction completion, never on individual request success. */
export class CadStorage {
    private async open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(CAD_DB, 1);
            req.onupgradeneeded = () => { req.result.createObjectStore('projects', { keyPath: 'id' }); req.result.createObjectStore('library', { keyPath: 'id' }); };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
            req.onblocked = () => reject(Error('Cierra otras pestañas del editor para actualizar el almacenamiento.'));
        });
    }
    private async write(store: string, value: CadDocument | FurnitureDefinition | string, remove = false): Promise<void> {
        const db = await this.open();
        try {
            await new Promise<void>((resolve, reject) => {
                const tx = db.transaction(store, 'readwrite');
                const s = tx.objectStore(store);
                if (remove)
                    s.delete(value as string);
                else
                    s.put(value);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(tx.error || Error('Guardado cancelado.'));
            });
        }
        finally {
            db.close();
        }
    }
    async projects(): Promise<CadDocument[]> { return (await this.read('projects')).map(parseDocument).sort((a, b) => b.updated.localeCompare(a.updated)); }
    async library(): Promise<FurnitureDefinition[]> { return (await this.read('library')).map(d => { validateDefinition(d); return d; }); }
    private async read(store: string): Promise<unknown[]> {
        const db = await this.open();
        try {
            return await new Promise<unknown[]>((resolve, reject) => { const req = db.transaction(store).objectStore(store).getAll(); req.onsuccess = () => resolve(req.result as unknown[]); req.onerror = () => reject(req.error); });
        }
        finally {
            db.close();
        }
    }
    save(doc: CadDocument): Promise<void> { return this.write('projects', parseDocument(doc)); }
    saveDefinition(d: FurnitureDefinition): Promise<void> { validateDefinition(d); return this.write('library', d); }
    remove(id: string): Promise<void> { return this.write('projects', id, true); }
}
