import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  template: `
    <input [id]="toggleId" type="checkbox" class="sidebar-toggle-input" />
    <label class="sidebar-toggle" [for]="toggleId" aria-label="Abrir o cerrar menú">☰ Menú</label>
    <div class="sidebar">
      <label class="sidebar-close" [for]="toggleId" aria-label="Cerrar menú">✕</label>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .sidebar-toggle-input,
      .sidebar-toggle {
        display: none;
      }

      .sidebar {
        background: var(--bg1);
        color: var(--ink);
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 6px 0 20px -20px #000;
      }

      @media (max-width: 768px) {
        .sidebar-toggle-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .sidebar-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 1rem 1rem;
          padding: 0.55rem 0.9rem;
          border: 1px solid var(--rule);
          border-radius: 999px;
          background: var(--paper);
          color: var(--ink);
          font-family: 'Courier Prime', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .sidebar {
          position: fixed;
          top: 5.25rem;
          left: 0;
          bottom: 0;
          width: min(80vw, 300px);
          max-width: 300px;
          padding: 1rem 0.75rem 1rem 1rem;
          background: var(--bg2);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.12);
          transform: translateX(-102%);
          transition: transform 0.25s ease;
          z-index: 40;
          overflow-y: auto;
        }

        .sidebar-close {
          position: sticky;
          top: 0;
          display: none;
          justify-content: flex-end;
          align-items: center;
          width: fit-content;
          margin: 0 0 0.75rem auto;
          padding: 0.25rem 0.35rem 0.5rem;
          background: rgba(15, 15, 24, 1);
          color: var(--ink);
          cursor: pointer;
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1;
          z-index: 5;
        }

        .sidebar-toggle-input:checked + .sidebar-toggle + .sidebar {
          transform: translateX(0);
        }

        .sidebar-toggle-input:checked + .sidebar-toggle + .sidebar .sidebar-close {
          display: flex;
        }
      }
    `,
  ],
})
export class MobileSidebarComponent {
  @Input() toggleId = 'sidebar-toggle';
}
