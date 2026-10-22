import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'bz-stat-card',
  imports: [DecimalPipe],
  template: `
    <strong [class.loading]="loading()">
      {{ loading() ? '' : value() === null ? '—' : (value() | number) }}
    </strong>
    <span>{{ label() }}</span>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 88px;
      padding: 12px;
      border: 1px solid var(--bz-focus-10);
      border-radius: var(--bz-radius);
      background: var(--bz-base);
    }
    strong {
      min-width: 48px;
      min-height: 28px;
      font: 400 24px/28px var(--bz-font-body);
      text-align: center;
    }
    .loading {
      border-radius: 6px;
      background: var(--bz-focus-10);
      animation: pulse 1s ease-in-out infinite alternate;
    }
    span {
      color: var(--bz-focus-50);
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-align: center;
    }
    @keyframes pulse { to { opacity: 0.4; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input<number | null>(null);
  readonly loading = input(false);
}
