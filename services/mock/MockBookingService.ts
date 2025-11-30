/**
 * Implémentation Mock du service Booking
 */

import { IBookingService, Booking, BookingFilters, CreateBookingDto, UpdateBookingDto } from '../interfaces/IBookingService';
import { bookings, boats } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockBookingService implements IBookingService {
  private bookings: Booking[] = [...(bookings as unknown as Booking[])];

  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    logApiOperation('bookings', 'getBookings', filters);
    await this.delay(300);
    
    let filteredBookings = [...this.bookings];
    
    if (filters) {
      if (filters.renterId !== undefined) {
        filteredBookings = filteredBookings.filter(b => b.renterId === filters.renterId);
      }
      
      if (filters.ownerId !== undefined) {
        filteredBookings = filteredBookings.filter(b => b.ownerId === filters.ownerId);
      }
      
      if (filters.status) {
        filteredBookings = filteredBookings.filter(b => b.status === filters.status);
      }
      
      if (filters.startDate) {
        filteredBookings = filteredBookings.filter(b => b.startDate >= filters.startDate!);
      }
      
      if (filters.endDate) {
        filteredBookings = filteredBookings.filter(b => b.endDate <= filters.endDate!);
      }
    }
    
    return filteredBookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    logApiOperation('bookings', 'getBookingById', { id });
    await this.delay(200);
    
    const booking = this.bookings.find(b => b.id === id);
    return booking || null;
  }

  async createBooking(bookingDto: CreateBookingDto): Promise<Booking> {
    logApiOperation('bookings', 'createBooking', bookingDto);
    await this.delay(500);
    
    const boat = boats.find(b => b.id === bookingDto.boatId);
    if (!boat) {
      throw new Error('Boat not found');
    }
    
    const newBooking: Booking = {
      id: 'BK' + Date.now().toString(36).toUpperCase(),
      boatId: bookingDto.boatId,
      boatName: boat.name,
      boatImage: boat.image,
      startDate: bookingDto.startDate,
      endDate: bookingDto.endDate,
      totalPrice: bookingDto.totalPrice,
      serviceFee: bookingDto.serviceFee,
      status: 'confirmed',
      ownerId: boat.ownerId,
      ownerName: boat.ownerName,
      renterId: bookingDto.renterId,
      renterName: bookingDto.renterName,
      createdAt: new Date().toISOString(),
    };
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBooking(bookingDto: UpdateBookingDto): Promise<Booking> {
    logApiOperation('bookings', 'updateBooking', bookingDto);
    await this.delay(400);
    
    const index = this.bookings.findIndex(b => b.id === bookingDto.id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    const updatedBooking = { ...this.bookings[index], ...bookingDto };
    this.bookings[index] = updatedBooking;
    
    return updatedBooking;
  }

  async cancelBooking(id: string): Promise<Booking> {
    logApiOperation('bookings', 'cancelBooking', { id });
    await this.delay(400);
    
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    this.bookings[index].status = 'cancelled';
    return this.bookings[index];
  }

  async getBookingsByRenter(renterId: number): Promise<Booking[]> {
    logApiOperation('bookings', 'getBookingsByRenter', { renterId });
    await this.delay(300);
    
    return this.bookings.filter(b => b.renterId === renterId);
  }

  async getBookingsByOwner(ownerId: number): Promise<Booking[]> {
    logApiOperation('bookings', 'getBookingsByOwner', { ownerId });
    await this.delay(300);
    
    return this.bookings.filter(b => b.ownerId === ownerId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
