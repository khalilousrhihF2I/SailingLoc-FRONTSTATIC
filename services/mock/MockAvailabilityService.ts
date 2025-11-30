/**
 * Implémentation Mock du service Availability
 */

import { IAvailabilityService, UnavailablePeriod, AvailabilityCheck, CreateAvailabilityDto, AddUnavailablePeriodDto } from '../interfaces/IAvailabilityService';
import { bookings } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';
import { validateBookingDates, checkDateRangeOverlap } from '../../utils/dateValidation';

export class MockAvailabilityService implements IAvailabilityService {
  private blockedPeriods: Map<number, UnavailablePeriod[]> = new Map();

  async checkAvailability(
    boatId: number,
    startDate: string,
    endDate: string,
    excludeBookingId?: string
  ): Promise<AvailabilityCheck> {
    logApiOperation('availability', 'checkAvailability', { boatId, startDate, endDate });
    await this.delay(200);

    // Valider les dates
    const validation = validateBookingDates(startDate, endDate);
    if (!validation.isValid) {
      return {
        isAvailable: false,
        message: validation.error || 'Dates invalides'
      };
    }

    // Récupérer les périodes indisponibles
    const unavailablePeriods = await this.getUnavailableDates(boatId, startDate, endDate);

    // Exclure la réservation spécifiée si nécessaire
    const periodsToCheck = excludeBookingId
      ? unavailablePeriods.filter(p => p.referenceId !== excludeBookingId)
      : unavailablePeriods;

    // Vérifier le chevauchement
    const { hasOverlap } = checkDateRangeOverlap(startDate, endDate, periodsToCheck);

    if (hasOverlap) {
      return {
        isAvailable: false,
        message: 'Ce bateau est déjà réservé ou indisponible sur cette période'
      };
    }

    return {
      isAvailable: true,
      message: 'Le bateau est disponible sur cette période'
    };
  }

  async getUnavailableDates(
    boatId: number,
    startDate?: string,
    endDate?: string
  ): Promise<UnavailablePeriod[]> {
    logApiOperation('availability', 'getUnavailableDates', { boatId, startDate, endDate });
    await this.delay(300);

    const unavailable: UnavailablePeriod[] = [];

    // Récupérer les réservations confirmées
    const boatBookings = bookings.filter(
      b => b.boatId === boatId && b.status !== 'cancelled'
    );

    boatBookings.forEach(booking => {
      // Filtrer par plage de dates si fournie
      if (startDate && endDate) {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);

        // Vérifier si la réservation est dans la plage
        if (bookingEnd < rangeStart || bookingStart > rangeEnd) {
          return; // Skip cette réservation
        }
      }

      unavailable.push({
        type: 'booking',
        referenceId: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        reason: booking.status,
        details: booking.renterName
      });
    });

    // Récupérer les périodes bloquées manuellement
    const blocked = this.blockedPeriods.get(boatId) || [];
    blocked.forEach(period => {
      // Filtrer par plage de dates si fournie
      if (startDate && endDate) {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);

        // Vérifier si la période est dans la plage
        if (periodEnd < rangeStart || periodStart > rangeEnd) {
          return; // Skip cette période
        }
      }

      unavailable.push(period);
    });

    return unavailable.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  async getUnavailablePeriods(boatId: number): Promise<UnavailablePeriod[]> {
    // Alias pour getUnavailableDates pour compatibilité avec AvailabilityCalendar
    return this.getUnavailableDates(boatId);
  }

  async addUnavailablePeriod(boatId: number, period: AddUnavailablePeriodDto): Promise<UnavailablePeriod> {
    logApiOperation('availability', 'addUnavailablePeriod', { boatId, period });
    await this.delay(400);

    // Valider les dates
    const validation = validateBookingDates(period.startDate, period.endDate);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Dates invalides');
    }

    // Créer la période bloquée
    const newPeriod: UnavailablePeriod = {
      type: 'blocked',
      referenceId: `blocked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startDate: period.startDate,
      endDate: period.endDate,
      reason: period.reason || 'Bloqué',
    };

    // Ajouter la période bloquée
    const existing = this.blockedPeriods.get(boatId) || [];
    existing.push(newPeriod);
    this.blockedPeriods.set(boatId, existing);

    return newPeriod;
  }

  async removeUnavailablePeriod(boatId: number, startDate: string): Promise<boolean> {
    logApiOperation('availability', 'removeUnavailablePeriod', { boatId, startDate });
    await this.delay(300);

    const existing = this.blockedPeriods.get(boatId) || [];
    const filtered = existing.filter(p => p.startDate !== startDate);
    
    if (filtered.length === existing.length) {
      // Aucune période trouvée
      throw new Error('Période non trouvée');
    }

    this.blockedPeriods.set(boatId, filtered);
    return true;
  }

  async blockPeriod(availability: CreateAvailabilityDto): Promise<boolean> {
    logApiOperation('availability', 'blockPeriod', availability);
    await this.delay(400);

    // Valider les dates
    const validation = validateBookingDates(availability.startDate, availability.endDate);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Dates invalides');
    }

    // Créer la période bloquée
    const newPeriod: UnavailablePeriod = {
      type: 'blocked',
      referenceId: `blocked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startDate: availability.startDate,
      endDate: availability.endDate,
      reason: availability.reason || 'Bloqué',
    };

    // Ajouter la période bloquée
    const existing = this.blockedPeriods.get(availability.boatId) || [];
    existing.push(newPeriod);
    this.blockedPeriods.set(availability.boatId, existing);

    return true;
  }

  async unblockPeriod(availabilityId: number): Promise<boolean> {
    logApiOperation('availability', 'unblockPeriod', { availabilityId });
    await this.delay(300);

    // Dans le mock, on ne peut pas facilement supprimer par ID
    // En production, cela supprimera l'entrée de la BDD
    console.warn('Mock: unblockPeriod - In production, this would delete from database');
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
