import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LayoutService } from '../../core/layout/layout.service';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  selector: 'bz-header',
  imports: [Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly router = inject(Router);
  protected readonly layout = inject(LayoutService);

  /** Page title taken from the deepest active route's `data.title`. */
  protected readonly title = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.currentTitle()),
    ),
    { initialValue: '' },
  );

  protected onSearch(event: Event): void {
    this.layout.searchTerm.set((event.target as HTMLInputElement).value);
  }

  private currentTitle(): string {
    let r = this.router.routerState.snapshot.root;
    while (r.firstChild) r = r.firstChild;
    return r.data?.['title'] ?? '';
  }
}
