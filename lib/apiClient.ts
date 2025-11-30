/**
 * Client HTTP pour les appels API
 * 
 * Gère les requêtes vers l'API .NET 8 avec retry, timeout, et gestion d'erreurs
 */

import { apiConfig } from '../config/apiMode';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseUrl = apiConfig.apiBaseUrl;
    this.timeout = apiConfig.options.timeout;
    this.retryAttempts = apiConfig.options.retryAttempts;
  }

  /**
   * Effectue une requête HTTP avec retry et timeout
   */
  private async fetchWithRetry(
    url: string, 
    options: RequestInit, 
    attempt: number = 0
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry en cas d'échec (sauf si c'est une erreur d'abort)
      if (attempt < this.retryAttempts && error instanceof Error && error.name !== 'AbortError') {
        console.warn(`Retry attempt ${attempt + 1} for ${url}`);
        await this.delay(1000 * (attempt + 1)); // Délai exponentiel
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message, status: error.status };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * POST request
   */
  async post<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const responseData = await response.json();
      return { data: responseData, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message, status: error.status };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * PUT request
   */
  async put<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const responseData = await response.json();
      return { data: responseData, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message, status: error.status };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = response.status !== 204 ? await response.json() : null;
      return { data, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message, status: error.status };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * PATCH request
   */
  async patch<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const responseData = await response.json();
      return { data: responseData, status: response.status };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message, status: error.status };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();
