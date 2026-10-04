import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent {
  storageMessage = '';

  clearSavedData(): void {
    this.storageMessage = '';
    if (
      !window.confirm(
        '¿Borrar las partidas de Sudoku, los sistemas de Gravedad y los borradores de viajes guardados en este navegador? Esta acción no se puede deshacer. Los archivos descargados se conservarán.',
      )
    )
      return;

    try {
      for (const key of [
        'sudoku',
        'gravity-system-v1',
        'travel_planner_draft',
      ]) {
        localStorage.removeItem(key);
      }
      // Remove legacy drafts for the root, deployment base and tool paths.
      const basePath = new URL(document.baseURI).pathname.replace(/\/$/, '');
      const paths = new Set([
        '/',
        basePath || '/',
        `${basePath}/`,
        `${basePath}/tools`,
        `${basePath}/tools/`,
        `${basePath}/tools/travel-planner`,
      ]);
      for (const path of paths) {
        document.cookie = `travel_planner_draft=; Max-Age=0; Path=${path}; SameSite=Lax; Secure`;
      }
      if (
        document.cookie
          .split(';')
          .some((cookie) => cookie.trim().startsWith('travel_planner_draft='))
      ) {
        throw new Error('Legacy draft could not be removed');
      }
      this.storageMessage =
        'Se han borrado los datos guardados de esta web en este navegador. Si tienes una herramienta abierta en otra pestaña, ciérrala o recárgala para evitar que vuelva a guardar sus datos.';
    } catch {
      this.storageMessage =
        'No se han podido borrar todos los datos. Puedes eliminarlos desde la configuración de almacenamiento de tu navegador. Si tienes otra pestaña de esta web abierta, ciérrala o recárgala.';
    }
  }
}
