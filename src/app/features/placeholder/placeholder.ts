import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Generic page for sections not built yet. `title` is bound from route data. */
@Component({
  selector: 'bz-placeholder',
  template: `
    <div class="empty">
      <h2>{{ title() }}</h2>
      <p>This section is not available yet.</p>
    </div>
  `,
  styles: `
    .empty {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 8px;
      min-height: 320px;
      border: 1px dashed var(--bz-focus-24);
      border-radius: var(--bz-radius);
      text-align: center;
    }
    h2 { font-size: 18px; }
    p { margin: 0; color: var(--bz-focus-50); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Placeholder {
  readonly title = input('');
}
