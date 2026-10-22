export type UserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER' | 'ORGANISATION' | string;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  [key: string]: unknown;
}

/** Standard envelope returned by the Buzzer API. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
