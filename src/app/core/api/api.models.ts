/** Pagination block returned by every list endpoint. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiList<T> {
  success: boolean;
  data: T[];
  meta: PageMeta;
}

export interface ApiItem<T> {
  success: boolean;
  data: T;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Builds HttpParams-compatible object, dropping empty values. */
export function toParams(query: ListQuery): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params[key] = String(value);
  }
  return params;
}
