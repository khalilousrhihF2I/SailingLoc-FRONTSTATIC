/**
 * Interface pour le service Boat
 * Définit le contrat que doivent respecter les implémentations mock et API
 */

export interface Boat {
  id: number;
  name: string;
  type: string;
  location: string;
  city: string;
  destination?: string;
  country: string;
  price: number;
  capacity: number;
  cabins: number;
  length: number;
  year: number;
  image: string;
  rating: number;
  reviews: number;
  equipment: string[];
  description: string;
  ownerId: number;
  ownerName: string;
  ownerAvatar: string;
}

export interface BoatFilters {
  location?: string;
  destination?: string;
  type?: string;
  priceMin?: number;
  priceMax?: number;
  capacityMin?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateBoatDto {
  name: string;
  type: string;
  location: string;
  city: string;
  destination?: string;
  country: string;
  price: number;
  capacity: number;
  cabins: number;
  length: number;
  year: number;
  image: string;
  equipment: string[];
  description: string;
  ownerId: number;
}

export interface UpdateBoatDto extends Partial<CreateBoatDto> {
  id: number;
}

export interface IBoatService {
  /**
   * Récupère tous les bateaux avec filtres optionnels
   */
  getBoats(filters?: BoatFilters): Promise<Boat[]>;
  
  /**
   * Récupère un bateau par son ID
   */
  getBoatById(id: number): Promise<Boat | null>;
  
  /**
   * Crée un nouveau bateau
   */
  createBoat(boat: CreateBoatDto): Promise<Boat>;
  
  /**
   * Met à jour un bateau existant
   */
  updateBoat(boat: UpdateBoatDto): Promise<Boat>;
  
  /**
   * Supprime un bateau
   */
  deleteBoat(id: number): Promise<boolean>;
  
  /**
   * Récupère les bateaux d'un propriétaire
   */
  getBoatsByOwner(ownerId: number): Promise<Boat[]>;
}
