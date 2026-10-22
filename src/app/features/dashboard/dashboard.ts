import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bz-dashboard',
  template: `
    <section class="card">
      <h2>Welcome to Buzzer Admin Console</h2>
      <p>Use the sidebar to navigate between sections.</p>
    </section>
  `,
  styles: `
    .card {
      padding: 24px;
      border: 1px solid var(--bz-focus-10);
      border-radius: var(--bz-radius);
      background: var(--bz-surface);
    }
    h2 { font-size: 20px; margin-bottom: 8px; }
    p { margin: 0; color: var(--bz-focus-50); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
