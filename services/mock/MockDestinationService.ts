/**
 * Service Mock pour la gestion des destinations
 * Utilise les données mockées en attendant l'API réelle
 */

import { IDestinationService, Destination } from '../interfaces/IDestinationService';
import { destinations } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockDestinationService implements IDestinationService {
  /**
   * Récupérer toutes les destinations
   */
  async getAllDestinations(): Promise<Destination[]> {
    logApiOperation('destinations', 'getAllDestinations');
    
    // Simuler un délai réseau
    await this.delay(300);
    
    return [...destinations];
  }

  /**
   * Récupérer une destination par son ID
   */
  async getDestinationById(id: number): Promise<Destination | null> {
    logApiOperation('destinations', 'getDestinationById', { id });
    
    await this.delay(200);
    
    const destination = destinations.find(d => d.id === id);
    return destination || null;
  }

  /**
   * Rechercher des destinations par critères
   */
  async searchDestinations(query: string): Promise<Destination[]> {
    logApiOperation('destinations', 'searchDestinations', { query });
    
    await this.delay(250);
    
    if (!query) {
      return [...destinations];
    }
    
    const lowerQuery = query.toLowerCase();
    return destinations.filter(d => 
      d.name.toLowerCase().includes(lowerQuery) ||
      d.country.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Récupérer les destinations par région
   */
  async getDestinationsByRegion(region: string): Promise<Destination[]> {
    logApiOperation('destinations', 'getDestinationsByRegion', { region });
    
    await this.delay(250);
    
    return destinations.filter(d => 
      d.country.toLowerCase() === region.toLowerCase() ||
      d.name.toLowerCase().includes(region.toLowerCase())
    );
  }

  /**
   * Récupérer les destinations populaires
   */
  async getPopularDestinations(limit: number = 4): Promise<Destination[]> {
    logApiOperation('destinations', 'getPopularDestinations', { limit });
    
    await this.delay(200);
    
    // Trier par nombre de bateaux (popularité)
    const sorted = [...destinations].sort((a, b) => b.boats - a.boats);
    return sorted.slice(0, limit);
  }

  /**
   * Utilitaire pour simuler un délai réseau
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
