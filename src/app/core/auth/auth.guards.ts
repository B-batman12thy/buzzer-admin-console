import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

/** Protects private routes: requires a token and a valid profile from GET /auth/me. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toLogin = router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (!auth.isAuthenticated()) return toLogin;
  if (auth.user()) return true;

  return auth.me().pipe(
    map(() => true),
    catchError(() => of(toLogin)),
  );
};

/** Keeps signed-in users away from the login page. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
