import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LoginData, LoginPayload, User } from './auth.models';
import { isTokenExpired, tokenExpiry, tokenStorage } from './token-storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = `${environment.apiBaseUrl}/auth`;
  private expiryTimer?: ReturnType<typeof setTimeout>;

  private readonly _token = signal<string | null>(this.restoreToken());
  private readonly _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}/login`, payload).pipe(
      map((res) => res.data),
      tap(({ accessToken, user }) => {
        this.setToken(accessToken);
        this._user.set(user);
      }),
      map(({ user }) => user),
    );
  }

  /** Loads the current user profile from GET /auth/me. */
  me(): Observable<User> {
    return this.http.get<ApiResponse<User | { user: User }>>(`${this.api}/me`).pipe(
      map((res) => ('user' in res.data ? (res.data as { user: User }).user : (res.data as User))),
      tap((user) => this._user.set(user)),
    );
  }

  /** Clears the session and sends the user to the login page. */
  logout(returnUrl?: string): void {
    clearTimeout(this.expiryTimer);
    tokenStorage.clear();
    this._token.set(null);
    this._user.set(null);
    const queryParams = returnUrl && returnUrl !== '/login' ? { returnUrl } : undefined;
    this.router.navigate(['/login'], { queryParams });
  }

  private setToken(token: string): void {
    tokenStorage.set(token);
    this._token.set(token);
    this.scheduleExpiry(token);
  }

  private restoreToken(): string | null {
    const token = tokenStorage.get();
    if (!token || isTokenExpired(token)) {
      tokenStorage.clear();
      return null;
    }
    this.scheduleExpiry(token);
    return token;
  }

  /** Redirects to login as soon as the JWT expires. */
  private scheduleExpiry(token: string): void {
    clearTimeout(this.expiryTimer);
    const exp = tokenExpiry(token);
    if (exp === null) return;
    this.expiryTimer = setTimeout(
      () => this.logout(this.router.url),
      Math.max(exp - Date.now(), 0),
    );
  }
}
