import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
  // If using an older module-based Angular, you might need to import CommonModule
})
export class HomeComponent implements OnInit {
  title = 'Home';
  User: User | null = null;
  activePage = 'home';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }

  // Helper function to navigate for the hero-buttons
  navigate(path: string): void {
    this.router.navigate([path]);
  }
}