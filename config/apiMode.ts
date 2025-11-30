/**
 * Configuration centrale pour le mode API
 * 
 * Permet de choisir entre les services mock et l'API réelle pour chaque ressource.
 * Si l'API .NET 8 n'est pas encore disponible, l'application peut fonctionner 100% en mode mock.
 */

export type ApiMode = 'mock' | 'api';

export interface ApiConfiguration {
  // Mode global par défaut
  defaultMode: ApiMode;
  
  // URL de base de l'API .NET 8
  apiBaseUrl: string;
  
  // Configuration par ressource - permet de choisir mock ou API pour chaque service
  services: {
    boats: ApiMode;
    users: ApiMode;
    bookings: ApiMode;
    destinations: ApiMode;
    reviews: ApiMode;
    auth: ApiMode;
    availability: ApiMode;
  };
  
  // Options supplémentaires
  options: {
    timeout: number; // Timeout pour les requêtes API en ms
    retryAttempts: number; // Nombre de tentatives en cas d'échec
    enableLogging: boolean; // Activer les logs de debug
  };
}

/**
 * Helper pour obtenir les variables d'environnement de manière sécurisée
 */
function getEnvVar(key: string, defaultValue: string): string {
  try {
    return import.meta?.env?.[key] || defaultValue;
  } catch (error) {
    console.warn(`Unable to access import.meta.env.${key}, using default value: ${defaultValue}`);
    return defaultValue;
  }
}

/**
 * Configuration API
 * 
 * Pour passer en mode API réelle :
 * 1. Mettez à jour apiBaseUrl avec l'URL de votre API .NET 8 dans le fichier .env
 * 2. Changez defaultMode à 'api'
 * 3. Ou modifiez individuellement chaque service dans services
 */
export const apiConfig: ApiConfiguration = {
  // Mode par défaut : 'mock' pour développement sans API, 'api' pour production
  defaultMode: 'mock',
  
  // URL de l'API .NET 8 (configurée via variable d'environnement)
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
  
  // Configuration par service
  // Vous pouvez activer l'API service par service au fur et à mesure du développement
  services: {
    boats: 'mock',      // GET /boats, GET /boats/:id, POST /boats, PUT /boats/:id, DELETE /boats/:id
    users: 'mock',      // GET /users, GET /users/:id, POST /users, PUT /users/:id
    bookings: 'mock',   // GET /bookings, GET /bookings/:id, POST /bookings, PUT /bookings/:id
    destinations: 'mock', // GET /destinations
    reviews: 'mock',    // GET /reviews, POST /reviews
    auth: 'mock',       // POST /auth/login, POST /auth/register, POST /auth/logout
    availability: 'mock', // GET /availability/check, GET /availability/unavailable, POST /availability/block
  },
  
  options: {
    timeout: 30000,       // 30 secondes
    retryAttempts: 2,     // 2 tentatives en cas d'échec
    enableLogging: true,  // Logs de debug activés
  }
};

/**
 * Helper pour savoir si un service doit utiliser l'API ou le mock
 */
export function shouldUseApi(serviceName: keyof ApiConfiguration['services']): boolean {
  return apiConfig.services[serviceName] === 'api';
}

/**
 * Helper pour obtenir le mode d'un service
 */
export function getServiceMode(serviceName: keyof ApiConfiguration['services']): ApiMode {
  return apiConfig.services[serviceName];
}

/**
 * Helper pour logger les opérations si le logging est activé
 */
export function logApiOperation(service: string, operation: string, data?: any): void {
  if (apiConfig.options.enableLogging) {
    const mode = apiConfig.services[service as keyof ApiConfiguration['services']] || 'unknown';
    console.log(`[${mode.toUpperCase()}] ${service}.${operation}`, data || '');
  }
}
