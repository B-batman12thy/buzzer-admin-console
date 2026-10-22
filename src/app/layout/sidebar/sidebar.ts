import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LayoutService } from '../../core/layout/layout.service';
import { NAV_GROUPS } from '../../core/layout/navigation';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  selector: 'bz-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.collapsed]': 'layout.sidebarCollapsed()' },
})
export class Sidebar {
  protected readonly layout = inject(LayoutService);
  protected readonly auth = inject(AuthService);
  protected readonly groups = NAV_GROUPS;
  protected readonly initial = computed(
    () => this.auth.user()?.email?.charAt(0).toUpperCase() ?? '?',
  );

  /** Labels of the navigation groups the user has folded. */
  private readonly foldedGroups = signal<ReadonlySet<string>>(new Set());

  protected isFolded(label: string): boolean {
    return this.foldedGroups().has(label);
  }

  protected toggleGroup(label: string): void {
    this.foldedGroups.update((current) => {
      const next = new Set(current);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }
}
