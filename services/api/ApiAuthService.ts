/**
 * Implémentation API du service Auth
 * Communique avec l'API .NET 8 pour l'authentification
 */

import { IAuthService, LoginCredentials, RegisterData, AuthResponse } from '../interfaces/IAuthService';
import { apiClient } from '../../lib/apiClient';
import { logApiOperation } from '../../config/apiMode';

export class ApiAuthService implements IAuthService {
  private readonly endpoint = '/auth';
  private readonly TOKEN_KEY = 'sailingloc_auth_token';
  private readonly USER_KEY = 'sailingloc_current_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logApiOperation('auth', 'login', { email: credentials.email });
    
    const response = await apiClient.post<AuthResponse>(`${this.endpoint}/login`, credentials);
    
    if (response.error || !response.data) {
      return {
        success: false,
        message: response.error || 'Login failed',
        user: { id: 0, name: '', email: '', type: 'renter' }
      };
    }
    
    const authData = response.data;
    
    // Stocker le token et l'utilisateur
    if (authData.success && authData.token) {
      localStorage.setItem(this.TOKEN_KEY, authData.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    }
    
    return authData;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    logApiOperation('auth', 'register', { ...data, password: '***' });
    
    const response = await apiClient.post<AuthResponse>(`${this.endpoint}/register`, data);
    
    if (response.error || !response.data) {
      return {
        success: false,
        message: response.error || 'Registration failed',
        user: { id: 0, name: '', email: '', type: 'renter' }
      };
    }
    
    const authData = response.data;
    
    // Stocker le token et l'utilisateur
    if (authData.success && authData.token) {
      localStorage.setItem(this.TOKEN_KEY, authData.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    }
    
    return authData;
  }

  async logout(): Promise<void> {
    logApiOperation('auth', 'logout');
    
    // Appeler l'API pour invalider le token côté serveur
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      await apiClient.post(`${this.endpoint}/logout`, {});
    }
    
    // Supprimer les données locales
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (!token || !user) {
      return false;
    }
    
    // Vérifier la validité du token auprès de l'API
    try {
      const response = await apiClient.get<{ valid: boolean }>(`${this.endpoint}/validate`);
      return response.data?.valid || false;
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
