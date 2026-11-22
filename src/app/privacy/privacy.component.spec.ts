import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent saved data deletion', () => {
  let component: PrivacyComponent;
  let removeItem: jasmine.Spy;

  beforeEach(() => {
    component = new PrivacyComponent();
    removeItem = spyOn(Storage.prototype, 'removeItem');
  });

  it('leaves storage untouched when the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.clearSavedData();
    expect(removeItem).not.toHaveBeenCalled();
    expect(component.storageMessage).toBe('');
  });

  it('deletes only the application keys after explicit confirmation', () => {
    const confirm = spyOn(window, 'confirm').and.returnValue(true);
    const cookie = spyOnProperty(document, 'cookie', 'set');
    spyOnProperty(document, 'cookie', 'get').and.returnValue('');
    component.clearSavedData();
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(removeItem.calls.allArgs()).toEqual([
      ['sudoku'],
      ['gravity-system-v1'],
      ['travel_planner_draft'],
    ]);
    expect(cookie).toHaveBeenCalled();
    expect(
      cookie.calls
        .allArgs()
        .every(([value]) =>
          value.startsWith('travel_planner_draft=; Max-Age=0;'),
        ),
    ).toBeTrue();
    expect(component.storageMessage).toContain('Se han borrado');
  });

  it('reports a failure instead of claiming successful deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    removeItem.and.throwError('Storage denied');
    component.clearSavedData();
    expect(component.storageMessage).toContain('No se han podido borrar todos');
  });

  it('reports a legacy cookie that remains after deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOnProperty(document, 'cookie', 'set');
    spyOnProperty(document, 'cookie', 'get').and.returnValue(
      'travel_planner_draft=old',
    );
    component.clearSavedData();
    expect(component.storageMessage).toContain('No se han podido borrar todos');
  });

  it('deletes only the CAD database and waits for its success event', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const request = {} as IDBOpenDBRequest;
    const deletion = spyOn(indexedDB, 'deleteDatabase').and.returnValue(request);
    component.clearCadData();
    expect(deletion).toHaveBeenCalledOnceWith('dsl-interior-cad');
    expect(component.cadStorageMessage).toContain('Borrando');
    request.onblocked!.call(request, new IDBVersionChangeEvent('blocked'));
    expect(component.cadStorageMessage).toContain('Cierra las pestañas');
    request.onsuccess!.call(request, new Event('success'));
    expect(component.cadStorageMessage).toContain('Se han borrado los proyectos');
    expect(removeItem).not.toHaveBeenCalled();
  });

  it('does not delete CAD data when confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const deletion = spyOn(indexedDB, 'deleteDatabase');
    component.clearCadData();
    expect(deletion).not.toHaveBeenCalled();
  });
});
