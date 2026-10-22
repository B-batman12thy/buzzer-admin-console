import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { Icon } from '../icon/icon';

/** Modal dialog shell (overlay, title bar, close on Escape/backdrop). */
@Component({
  selector: 'bz-dialog',
  imports: [Icon],
  template: `
    <div class="backdrop" (click)="closed.emit()"></div>
    <section
      class="panel"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="titleId"
      [style.max-width.px]="width()"
    >
      <header>
        <h2 [id]="titleId">{{ title() }}</h2>
        <button type="button" class="close" aria-label="Close" (click)="closed.emit()">
          <bz-icon name="close" />
        </button>
      </header>
      <ng-content />
    </section>
  `,
  styleUrl: './dialog.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog implements AfterViewInit {
  readonly title = input.required<string>();
  readonly width = input(492);
  readonly closed = output<void>();

  protected readonly titleId = `bz-dialog-${Math.random().toString(36).slice(2, 8)}`;
  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const first = this.host.nativeElement.querySelector(
      'input, textarea, button:not(.close)',
    ) as HTMLElement | null;
    first?.focus();
  }
}
