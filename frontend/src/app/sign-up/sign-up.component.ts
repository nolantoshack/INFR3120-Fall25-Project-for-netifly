import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class SignUpComponent implements OnInit {
  title = 'Register';
  User: User | null = null;
  activePage = 'signup';
  error: string | null = null;

  formData = {
    fullName: '',
    email: '',
    password: '',
    role: 'Driver' // Default role
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }

  register(): void {
    this.error = null;

    this.authService.register(this.formData).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        // Redirect to trucks page after successful registration/login
        this.router.navigate(['/trucks']);
      }
    });
  }
}