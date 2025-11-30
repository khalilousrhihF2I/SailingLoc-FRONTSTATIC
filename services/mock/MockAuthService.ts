/**
 * Implémentation Mock du service Auth
 */

import { IAuthService, LoginCredentials, RegisterData, AuthResponse } from '../interfaces/IAuthService';
import { users } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockAuthService implements IAuthService {
  private currentUser: AuthResponse['user'] | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    logApiOperation('auth', 'login', { email: credentials.email });
    await this.delay(500);
    
    // Utilisateurs de test
    const testAccounts = [
      { email: 'admin@sailingloc.com', password: 'admin123', type: 'admin' as const },
      { email: 'owner@example.com', password: 'demo123', type: 'owner' as const },
      { email: 'renter@example.com', password: 'demo123', type: 'renter' as const },
    ];
    
    const testAccount = testAccounts.find(
      acc => acc.email === credentials.email && acc.password === credentials.password
    );
    
    if (testAccount) {
      this.currentUser = {
        id: testAccount.type === 'admin' ? 999 : testAccount.type === 'owner' ? 1 : 101,
        name: testAccount.type === 'admin' ? 'Admin' : testAccount.type === 'owner' ? 'Jean Dupont' : 'Thomas Petit',
        email: testAccount.email,
        type: testAccount.type,
      };
      
      return {
        user: this.currentUser,
        token: 'mock-jwt-token-' + Date.now(),
        success: true,
      };
    }
    
    // Chercher dans les utilisateurs mock
    const user = users.find(u => u.email === credentials.email);
    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type as 'renter' | 'owner' | 'admin',
      };
      
      return {
        user: this.currentUser,
        token: 'mock-jwt-token-' + Date.now(),
        success: true,
      };
    }
    
    return {
      user: { id: 0, name: '', email: '', type: 'renter' },
      success: false,
      message: 'Email ou mot de passe incorrect',
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    logApiOperation('auth', 'register', { ...data, password: '***' });
    await this.delay(600);
    
    // Vérifier si l'email existe déjà
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      return {
        user: { id: 0, name: '', email: '', type: 'renter' },
        success: false,
        message: 'Cet email est déjà utilisé',
      };
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: data.name,
      email: data.email,
      type: data.type,
    };
    
    this.currentUser = newUser;
    
    return {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
      success: true,
      message: 'Compte créé avec succès',
    };
  }

  async logout(): Promise<void> {
    logApiOperation('auth', 'logout');
    await this.delay(200);
    
    this.currentUser = null;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.delay(100);
    return this.currentUser !== null;
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    await this.delay(100);
    return this.currentUser;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
