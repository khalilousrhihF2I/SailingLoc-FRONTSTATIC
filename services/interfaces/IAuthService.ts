/**
 * Interface pour le service Auth
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  type: 'renter' | 'owner';
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    type: 'renter' | 'owner' | 'admin';
  };
  token?: string;
  success: boolean;
  message?: string;
}

export interface IAuthService {
  /**
   * Authentifie un utilisateur
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  
  /**
   * Enregistre un nouvel utilisateur
   */
  register(data: RegisterData): Promise<AuthResponse>;
  
  /**
   * Déconnecte l'utilisateur
   */
  logout(): Promise<void>;
  
  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): Promise<boolean>;
  
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): Promise<AuthResponse['user'] | null>;
}
