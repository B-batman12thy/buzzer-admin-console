import { Injectable, signal } from '@angular/core';

/** Shared UI state for the application shell. */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly sidebarCollapsed = signal(
    typeof window !== 'undefined' && window.innerWidth < 1024,
  );

  /** Global search term typed in the header (consumed by pages). */
  readonly searchTerm = signal('');

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
