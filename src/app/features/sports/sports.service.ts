import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiItem, ApiList, ListQuery, toParams } from '../../core/api/api.models';
import { CatalogueTotals, Sport, SportInput } from './sport.model';

@Injectable({ providedIn: 'root' })
export class SportsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/organizations`;

  list(query: ListQuery): Observable<ApiList<Sport>> {
    return this.http.get<ApiList<Sport>>(`${this.base}/sports`, { params: toParams(query) });
  }

  create(input: SportInput): Observable<Sport> {
    return this.http
      .post<ApiItem<Sport>>(`${this.base}/sports`, input)
      .pipe(map((res) => res.data));
  }

  update(id: string, input: SportInput): Observable<Sport> {
    return this.http
      .patch<ApiItem<Sport>>(`${this.base}/sports/${id}`, input)
      .pipe(map((res) => res.data));
  }

  /** Soft delete: the sport disappears from every list. */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/sports/${id}`);
  }

  /** Stat cards: each total is `meta.total` of a `?limit=1` request. */
  totals(): Observable<CatalogueTotals> {
    const total = (path: string) =>
      this.http.get<ApiList<unknown>>(`${this.base}/${path}`, { params: { limit: 1 } }).pipe(
        map((res) => res.meta.total),
        catchError(() => of(null)),
      );

    return forkJoin({
      sports: total('sports'),
      governingBodies: total('governing-bodies'),
      organisations: total('organizations'),
      participants: total('players'),
    });
  }
}
