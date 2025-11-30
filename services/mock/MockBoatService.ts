/**
 * Implémentation Mock du service Boat
 * Utilise les données mockées pour le développement sans API
 */

import { IBoatService, Boat, BoatFilters, CreateBoatDto, UpdateBoatDto } from '../interfaces/IBoatService';
import { boats } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockBoatService implements IBoatService {
  private boats: Boat[] = [...boats];

  async getBoats(filters?: BoatFilters): Promise<Boat[]> {
    logApiOperation('boats', 'getBoats', filters);
    
    // Simuler un délai réseau
    await this.delay(300);
    
    let filteredBoats = [...this.boats];
    
    if (filters) {
      if (filters.location) {
        filteredBoats = filteredBoats.filter(boat => 
          boat.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.destination) {
        filteredBoats = filteredBoats.filter(boat => 
          boat.destination && boat.destination.toLowerCase().includes(filters.destination!.toLowerCase())
        );
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredBoats = filteredBoats.filter(boat => boat.type === filters.type);
      }
      
      if (filters.priceMin !== undefined) {
        filteredBoats = filteredBoats.filter(boat => boat.price >= filters.priceMin!);
      }
      
      if (filters.priceMax !== undefined) {
        filteredBoats = filteredBoats.filter(boat => boat.price <= filters.priceMax!);
      }
      
      if (filters.capacityMin !== undefined) {
        filteredBoats = filteredBoats.filter(boat => boat.capacity >= filters.capacityMin!);
      }
    }
    
    return filteredBoats;
  }

  async getBoatById(id: number): Promise<Boat | null> {
    logApiOperation('boats', 'getBoatById', { id });
    await this.delay(200);
    
    const boat = this.boats.find(b => b.id === id);
    return boat || null;
  }

  async createBoat(boatDto: CreateBoatDto): Promise<Boat> {
    logApiOperation('boats', 'createBoat', boatDto);
    await this.delay(500);
    
    const newBoat: Boat = {
      ...boatDto,
      id: Math.max(...this.boats.map(b => b.id)) + 1,
      rating: 0,
      reviews: 0,
      ownerAvatar: boatDto.ownerId.toString().substring(0, 2).toUpperCase(),
      ownerName: 'Nouveau Propriétaire',
    };
    
    this.boats.push(newBoat);
    return newBoat;
  }

  async updateBoat(boatDto: UpdateBoatDto): Promise<Boat> {
    logApiOperation('boats', 'updateBoat', boatDto);
    await this.delay(400);
    
    const index = this.boats.findIndex(b => b.id === boatDto.id);
    if (index === -1) {
      throw new Error('Boat not found');
    }
    
    const updatedBoat = { ...this.boats[index], ...boatDto };
    this.boats[index] = updatedBoat;
    
    return updatedBoat;
  }

  async deleteBoat(id: number): Promise<boolean> {
    logApiOperation('boats', 'deleteBoat', { id });
    await this.delay(300);
    
    const index = this.boats.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    
    this.boats.splice(index, 1);
    return true;
  }

  async getBoatsByOwner(ownerId: number): Promise<Boat[]> {
    logApiOperation('boats', 'getBoatsByOwner', { ownerId });
    await this.delay(300);
    
    return this.boats.filter(b => b.ownerId === ownerId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
