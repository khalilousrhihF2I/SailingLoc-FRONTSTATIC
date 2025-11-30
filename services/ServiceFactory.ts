import { shouldUseApi } from '../config/apiMode';

// Mock services
import { MockBoatService } from './mock/MockBoatService';
import { MockUserService } from './mock/MockUserService';
import { MockBookingService } from './mock/MockBookingService';
import { MockAuthService } from './mock/MockAuthService';
import { MockAvailabilityService } from './mock/MockAvailabilityService';

// API services
import { ApiBoatService } from './api/ApiBoatService';
import { ApiUserService } from './api/ApiUserService';
import { ApiBookingService } from './api/ApiBookingService';
import { ApiAuthService } from './api/ApiAuthService';
import { ApiAvailabilityService } from './api/ApiAvailabilityService';

// Singleton factory to expose the correct service instances depending on config
const boatService = shouldUseApi('boats') ? new ApiBoatService() : new MockBoatService();
const userService = shouldUseApi('users') ? new ApiUserService() : new MockUserService();
const bookingService = shouldUseApi('bookings') ? new ApiBookingService() : new MockBookingService();
const authService = shouldUseApi('auth') ? new ApiAuthService() : new MockAuthService();
const availabilityService = shouldUseApi('availability') ? new ApiAvailabilityService() : new MockAvailabilityService();

export {
  boatService,
  userService,
  bookingService,
  authService,
  availabilityService,
};

export default {
  boatService,
  userService,
  bookingService,
  authService,
  availabilityService,
};
