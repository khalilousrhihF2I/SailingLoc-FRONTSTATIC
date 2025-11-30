/**
 * Service Mock pour la gestion des avis
 * Utilise les données mockées en attendant l'API réelle
 */

import { IReviewService, Review, CreateReviewInput } from '../interfaces/IReviewService';
import { reviews as initialReviews } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockReviewService implements IReviewService {
  private reviews: Review[] = [...initialReviews];
  private nextId: number = Math.max(...initialReviews.map(r => r.id)) + 1;

  /**
   * Récupérer tous les avis
   */
  async getAllReviews(): Promise<Review[]> {
    logApiOperation('reviews', 'getAllReviews');
    
    await this.delay(300);
    
    return [...this.reviews];
  }

  /**
   * Récupérer les avis d'un bateau
   */
  async getReviewsByBoatId(boatId: number): Promise<Review[]> {
    logApiOperation('reviews', 'getReviewsByBoatId', { boatId });
    
    await this.delay(250);
    
    return this.reviews.filter(r => r.boatId === boatId);
  }

  /**
   * Récupérer un avis par son ID
   */
  async getReviewById(id: number): Promise<Review | null> {
    logApiOperation('reviews', 'getReviewById', { id });
    
    await this.delay(200);
    
    const review = this.reviews.find(r => r.id === id);
    return review || null;
  }

  /**
   * Créer un nouvel avis
   */
  async createReview(input: CreateReviewInput): Promise<Review> {
    logApiOperation('reviews', 'createReview', input);
    
    await this.delay(400);
    
    const newReview: Review = {
      id: this.nextId++,
      boatId: input.boatId,
      userName: input.userName || 'Utilisateur',
      userAvatar: input.userAvatar || 'U',
      rating: input.rating,
      date: new Date().toISOString().split('T')[0],
      comment: input.comment
    };
    
    this.reviews.unshift(newReview);
    
    return newReview;
  }

  /**
   * Supprimer un avis
   */
  async deleteReview(id: number): Promise<boolean> {
    logApiOperation('reviews', 'deleteReview', { id });
    
    await this.delay(300);
    
    const index = this.reviews.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }
    
    this.reviews.splice(index, 1);
    return true;
  }

  /**
   * Récupérer la moyenne des notes d'un bateau
   */
  async getAverageRating(boatId: number): Promise<number> {
    logApiOperation('reviews', 'getAverageRating', { boatId });
    
    await this.delay(200);
    
    const boatReviews = this.reviews.filter(r => r.boatId === boatId);
    
    if (boatReviews.length === 0) {
      return 0;
    }
    
    const sum = boatReviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / boatReviews.length).toFixed(1));
  }

  /**
   * Récupérer les avis récents (tous bateaux)
   */
  async getRecentReviews(limit: number = 10): Promise<Review[]> {
    logApiOperation('reviews', 'getRecentReviews', { limit });
    
    await this.delay(250);
    
    // Trier par date (plus récents en premier)
    const sorted = [...this.reviews].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sorted.slice(0, limit);
  }

  /**
   * Utilitaire pour simuler un délai réseau
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
