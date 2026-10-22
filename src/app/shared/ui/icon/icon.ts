import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'dashboard'
  | 'users'
  | 'registrations'
  | 'reporting'
  | 'devices'
  | 'words'
  | 'verified'
  | 'video'
  | 'blog'
  | 'referrals'
  | 'sports'
  | 'search'
  | 'panel'
  | 'chevron-down';

@Component({
  selector: 'bz-icon',
  templateUrl: './icon.html',
  styles: `
    :host { display: inline-flex; flex-shrink: 0; }
    svg { width: 100%; height: 100%; }
  `,
  host: { '[style.width.px]': 'size()', '[style.height.px]': 'size()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
}
