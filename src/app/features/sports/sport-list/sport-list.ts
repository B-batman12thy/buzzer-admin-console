import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { PageMeta } from '../../../core/api/api.models';
import { AuthService } from '../../../core/auth/auth.service';
import { LayoutService } from '../../../core/layout/layout.service';
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/confirm-dialog';
import { Icon } from '../../../shared/ui/icon/icon';
import { StatCard } from '../../../shared/ui/stat-card/stat-card';
import { CatalogueTotals, Sport } from '../sport.model';
import { SportDialog } from '../sport-dialog/sport-dialog';
import { SportsService } from '../sports.service';

const PAGE_SIZE = 10;
/** Row accents picked from the design system palette (not stored server-side). */
const ACCENTS = ['--bz-yellow', '--bz-red', '--bz-green', '--bz-orange'];

type DialogState = { mode: 'create' } | { mode: 'edit'; sport: Sport } | null;

@Component({
  selector: 'bz-sport-list',
  imports: [StatCard, Icon, SportDialog, ConfirmDialog],
  templateUrl: './sport-list.html',
  styleUrl: './sport-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportList implements OnDestroy {
  private readonly sportsApi = inject(SportsService);
  private readonly layout = inject(LayoutService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  /** Header search, debounced, sent to the backend as ?search=. */
  private readonly search = toSignal(
    toObservable(this.layout.searchTerm).pipe(
      debounceTime(300),
      map((term) => term.trim()),
      distinctUntilChanged(),
    ),
    { initialValue: this.layout.searchTerm().trim() },
  );

  /** Back to page 1 whenever the search changes. */
  protected readonly page = linkedSignal({ source: this.search, computation: () => 1 });
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');
  private readonly refresh = signal(0);

  protected readonly sports = signal<Sport[]>([]);
  protected readonly meta = signal<PageMeta | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly totals = signal<CatalogueTotals | null>(null);

  protected readonly dialog = signal<DialogState>(null);
  protected readonly toDelete = signal<Sport | null>(null);
  protected readonly deleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  protected readonly canEdit = computed(() => this.auth.user()?.role !== 'VIEWER');
  protected readonly searchTerm = this.search;

  constructor() {
    const query = computed(() => ({
      search: this.search(),
      page: this.page(),
      sortOrder: this.sortOrder(),
      refresh: this.refresh(),
    }));

    toObservable(query)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.loadError.set(null);
        }),
        switchMap(({ search, page, sortOrder }) =>
          this.sportsApi
            .list({ search, page, limit: PAGE_SIZE, sortBy: 'name', sortOrder })
            .pipe(catchError((err: unknown) => of(err))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        this.loading.set(false);
        if (res instanceof HttpErrorResponse || res instanceof Error) {
          this.loadError.set('Could not load the sports catalogue.');
          return;
        }
        const list = res as { data: Sport[]; meta: PageMeta };
        this.sports.set(list.data);
        this.meta.set(list.meta);
        // A delete can leave the current page empty: step back one page.
        if (!list.data.length && this.page() > 1) this.page.update((p) => p - 1);
      });

    toObservable(this.refresh)
      .pipe(
        switchMap(() => this.sportsApi.totals()),
        takeUntilDestroyed(),
      )
      .subscribe((totals) => this.totals.set(totals));
  }

  ngOnDestroy(): void {
    this.layout.searchTerm.set('');
  }

  protected accent(index: number): string {
    return `var(${ACCENTS[index % ACCENTS.length]})`;
  }

  protected toggleSort(): void {
    this.sortOrder.update((o) => (o === 'asc' ? 'desc' : 'asc'));
  }

  protected goTo(page: number): void {
    const last = this.meta()?.totalPages ?? 1;
    if (page >= 1 && page <= last) this.page.set(page);
  }

  protected onSaved(): void {
    this.dialog.set(null);
    this.reload();
  }

  protected askDelete(sport: Sport): void {
    this.deleteError.set(null);
    this.toDelete.set(sport);
  }

  protected confirmDelete(): void {
    const sport = this.toDelete();
    if (!sport) return;
    this.deleting.set(true);
    this.sportsApi
      .remove(sport.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.toDelete.set(null);
          this.reload();
        },
        error: (err: unknown) => {
          this.deleting.set(false);
          this.deleteError.set(
            err instanceof HttpErrorResponse && err.status === 403
              ? 'Your account is not allowed to delete sports.'
              : 'Could not delete the sport. Please try again.',
          );
        },
      });
  }

  /** Sports whose iconUrl failed to load: they fall back to an initial badge. */
  protected readonly brokenIcons = signal<ReadonlySet<string>>(new Set());

  protected markBroken(id: string): void {
    this.brokenIcons.update((set) => new Set(set).add(id));
  }

  private reload(): void {
    this.refresh.update((n) => n + 1);
  }
}
