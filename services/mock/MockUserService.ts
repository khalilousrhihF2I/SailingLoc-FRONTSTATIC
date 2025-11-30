/**
 * Implémentation Mock du service User
 */

import { IUserService, User, CreateUserDto, UpdateUserDto } from '../interfaces/IUserService';
import { users } from '../../data/mockData';
import { logApiOperation } from '../../config/apiMode';

export class MockUserService implements IUserService {
  private users: User[] = [...(users as unknown as User[])];

  async getUsers(): Promise<User[]> {
    logApiOperation('users', 'getUsers');
    await this.delay(300);
    return [...this.users];
  }

  async getUserById(id: number): Promise<User | null> {
    logApiOperation('users', 'getUserById', { id });
    await this.delay(200);
    
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    logApiOperation('users', 'getUserByEmail', { email });
    await this.delay(200);
    
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    logApiOperation('users', 'createUser', { ...userDto, password: '***' });
    await this.delay(500);
    
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      name: userDto.name,
      email: userDto.email,
      type: userDto.type,
      avatar: userDto.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      phone: userDto.phone,
      verified: false,
      documents: [],
      memberSince: new Date().toISOString().substring(0, 7),
      boatsCount: userDto.type === 'owner' ? 0 : undefined,
      totalRevenue: userDto.type === 'owner' ? 0 : undefined,
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userDto: UpdateUserDto): Promise<User> {
    logApiOperation('users', 'updateUser', userDto);
    await this.delay(400);
    
    const index = this.users.findIndex(u => u.id === userDto.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...this.users[index], ...userDto };
    this.users[index] = updatedUser;
    
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    logApiOperation('users', 'deleteUser', { id });
    await this.delay(300);
    
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }
    
    this.users.splice(index, 1);
    return true;
  }

  async verifyUser(id: number): Promise<User> {
    logApiOperation('users', 'verifyUser', { id });
    await this.delay(300);
    
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    this.users[index].verified = true;
    return this.users[index];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
