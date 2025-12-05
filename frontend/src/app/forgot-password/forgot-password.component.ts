import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class ForgotPasswordComponent implements OnInit {
  title = 'Forgot Password';
  User: User | null = null;
  activePage = 'forgot-password';
  email: string = '';
  error: string | null = null;
  success: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }

  submitForgotPassword(): void {
    this.error = null;
    this.success = null;

    this.authService.forgotPassword(this.email).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        // The backend response suggests it returns a generic message,
        // which is good practice for security.
        this.success = response.message || 'If an account was found, a reset link has been sent to your email.';

        // For your lab project demo, which returns userId on success, 
        // you might want to log it or use it for the reset link simulation.
        // console.log("Demo userId to use for next step:", response.userId);
      }
    });
  }
}