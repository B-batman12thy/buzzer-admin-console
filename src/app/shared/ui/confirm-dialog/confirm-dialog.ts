import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'bz-confirm-dialog',
  imports: [Dialog],
  template: `
    <bz-dialog [title]="title()" [width]="420" (closed)="cancelled.emit()">
      <p class="message">{{ message() }}</p>
      @if (error(); as err) {
        <p class="error" role="alert">{{ err }}</p>
      }
      <footer class="bz-dialog-actions">
        <button type="button" class="bz-btn bz-btn--outline" (click)="cancelled.emit()">
          Cancel
        </button>
        <button
          type="button"
          class="bz-btn bz-btn--danger"
          [disabled]="busy()"
          (click)="confirmed.emit()"
        >
          {{ busy() ? 'Deleting…' : confirmLabel() }}
        </button>
      </footer>
    </bz-dialog>
  `,
  styles: `
    .message { margin: 0 0 16px; color: var(--bz-focus-50); line-height: 1.5; }
    .error { margin: 0 0 16px; color: var(--bz-red); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Delete');
  readonly busy = input(false);
  readonly error = input<string | null>(null);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
