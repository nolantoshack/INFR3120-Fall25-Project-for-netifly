import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TrucksService } from '../services/trucks.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['../../../public/css/form_style.css'], // Adjust path if needed
})
export class CreateComponent implements OnInit {
  title = 'Log New Trip';
  User: User | null = null;
  activePage = 'create';
  error: string | null = null;
  success: string | null = null;

  tripData = {
    tripName: '',
    truckId: '',
    driverName: '',
    routeStart: '',
    routeEnd: '',
    scheduledDeparture: '',
    estimatedArrival: '',
    cargoType: '',
    weightKg: 0,
    manifestSummary: '',
    status: 'Scheduled'
  };

  constructor(
    private authService: AuthService,
    private trucksService: TrucksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (!this.User) {
        this.router.navigate(['/login']);
      }
      // Pre-fill driverName if user is logged in
      if (this.User && !this.tripData.driverName) {
        this.tripData.driverName = this.User.fullName;
      }
    });
  }

  logTrip(): void {
    this.error = null;
    this.success = null;

    // Convert string dates to ISO format if needed, though most backends handle YYYY-MM-DD
    const payload = {
        ...this.tripData,
        weightKg: Number(this.tripData.weightKg) // Ensure weight is a number
    };

    this.trucksService.createTrip(payload).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip logged successfully!';
        // Reset form for new entry or redirect
        this.tripData = { ...this.tripData, tripName: '', truckId: '', routeStart: '', routeEnd: '', scheduledDeparture: '', estimatedArrival: '', cargoType: '', weightKg: 0, manifestSummary: '' };
        // Redirect after a short delay
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }
}