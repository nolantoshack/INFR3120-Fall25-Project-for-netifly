import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { Trip } from '../models/trip.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.component.html',
  styleUrls: ['/src/css/form_style.css','/src/css/style.css'] // Adjust path if needed
})
export class TrucksComponent implements OnInit {
  title = 'Active Trips';
  User: User | null = null;
  activePage = 'trucks';
  trips: Trip[] = [];
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private trucksService: TrucksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      // Fetch data only if user is logged in (Authentication logic should be in a guard, but checking here for simplicity)
      if (this.User) {
        this.fetchTrips();
      } else {
        // Redirect unauthenticated users
        this.router.navigate(['/login']);
      }
    });
  }

  fetchTrips(): void {
    this.trucksService.getTrips().subscribe(response => {
      if (response.error) {
        this.error = response.error;
        this.trips = [];
      } else {
        this.trips = response as Trip[];
        this.error = null;
      }
    });
  }

  // Format date utility (as the HTML shows date manipulation)
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toISOString().substring(0, 10);
    } catch {
      return '-';
    }
  }
}