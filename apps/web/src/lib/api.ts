import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Set a simple cookie so middleware can detect auth state
  document.cookie = `hasAuth=true; path=/; max-age=86400; SameSite=Lax`;
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear the auth cookie
  document.cookie = 'hasAuth=; path=/; max-age=0';
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh on 401 – queue pending requests while refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request was the refresh itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<LoginResponse>(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken: storedRefreshToken },
      );
      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ---------------------------------------------------------------------------
// Auth API functions
// ---------------------------------------------------------------------------
export async function register(payload: RegisterPayload): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout(userId: string): Promise<void> {
  try {
    await api.post('/auth/logout', { userId });
  } finally {
    clearTokens();
  }
}

export async function refreshToken(): Promise<LoginResponse> {
  const storedRefreshToken = getRefreshToken();
  if (!storedRefreshToken) throw new Error('No refresh token available');
  const { data } = await api.post<LoginResponse>('/auth/refresh', {
    refreshToken: storedRefreshToken,
  });
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/verify-email', { token });
  return data;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', payload);
  return data;
}

export async function getMe(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>('/auth/me');
  return data;
}

export default api;
