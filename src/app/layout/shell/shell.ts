import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'bz-shell',
  imports: [RouterOutlet, Sidebar, Header],
  template: `
    <bz-sidebar />
    <div class="main">
      <bz-header />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .main {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 8px var(--bz-gap) var(--bz-gap);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {}
