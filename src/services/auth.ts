import apiClient from '@/lib/axios';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/types';

export const TOKEN_KEY = 'timevalley_token';
export const USER_KEY = 'timevalley_user_session';
export const REMEMBERED_EMAIL_KEY = 'timevalley_remembered_email';

export const authService = {
  /**
   * Register a new user with NestJS backend
   * POST /auth/register
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', dto);
    if (response.data.accessToken) {
      this.saveAuthData(response.data.accessToken, response.data.user);
    }
    return response.data;
  },

  /**
   * Login user with NestJS backend
   * POST /auth/login
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', dto);
    if (response.data.accessToken) {
      this.saveAuthData(response.data.accessToken, response.data.user);
    }
    return response.data;
  },

  /**
   * Send password reset OTP code via email
   * POST /auth/forgot-password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Verify 6-digit OTP code
   * POST /auth/verify-reset-code
   */
  async verifyResetCode(email: string, code: string): Promise<{ success: boolean; token: string }> {
    const response = await apiClient.post<{ success: boolean; token: string }>('/auth/verify-reset-code', { email, code });
    return response.data;
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  /**
   * Get active user profile from backend
   * GET /auth/me
   */
  async getMe(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      if (response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        }
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Save access token and user info to localStorage
   */
  saveAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user profile from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  /**
   * Save user profile to localStorage
   */
  setStoredUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Clear session data from localStorage
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get remembered email for pre-filling sign in
   */
  getRememberedEmail(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  },

  /**
   * Store or clear remembered email based on rememberMe flag
   */
  setRememberedEmail(email: string, rememberMe: boolean): void {
    if (typeof window === 'undefined') return;
    if (rememberMe && email.trim()) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  },
};

export default authService;
