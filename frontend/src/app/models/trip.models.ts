import { User } from './user.model';

export interface Trip {
  _id: string;
  tripName: string;
  truckId: string;
  driverName: string;
  routeStart: string;
  routeEnd: string;
  scheduledDeparture?: string; // ISO Date string
  estimatedArrival?: string; // ISO Date string
  cargoType: string;
  weightKg: number;
  manifestSummary: string;
  status: 'Scheduled' | 'In-Transit' | 'Completed' | 'Delayed';
  user?: User; // Optional user object if populated
}