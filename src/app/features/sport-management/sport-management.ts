import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Sport catalogue page — implemented in Task 3. */
@Component({
  selector: 'bz-sport-management',
  template: `<p class="hint">Sport catalogue coming in Task 3.</p>`,
  styles: `.hint { color: var(--bz-focus-50); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportManagement {}
