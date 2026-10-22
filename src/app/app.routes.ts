import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';
import { Shell } from './layout/shell/shell';

const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign in | Buzzer',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard | Buzzer',
        data: { title: 'Dashboard' },
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'sports',
        title: 'Sport Management | Buzzer',
        data: { title: 'Sport Management' },
        loadComponent: () =>
          import('./features/sport-management/sport-management').then((m) => m.SportManagement),
      },
      ...[
        ['verifications', 'Verifications'],
        ['videos', 'Videos'],
        ['blog-requests', 'Athlete Blog Requests'],
        ['restricted-words', 'Restricted Words'],
        ['referrals', 'Referrals'],
        ['registrations', 'Registrations'],
        ['users', 'Users'],
        ['reporting', 'Reporting'],
        ['restricted-devices', 'Restricted Devices'],
      ].map(([path, title]) => ({
        path,
        title: `${title} | Buzzer`,
        data: { title },
        loadComponent: placeholder,
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
