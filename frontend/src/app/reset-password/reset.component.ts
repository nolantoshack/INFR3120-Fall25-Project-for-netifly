import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class ResetPasswordComponent implements OnInit {
  title = 'Set New Password';
  User: User | null = null;
  activePage = 'reset-password';
  userId: string | null = null;
  error: string | null = null;
  success: string | null = null;

  formData = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });

    // The user ID is passed as a query parameter (or route parameter in a real token-based flow)
    // I'll assume a query parameter 'userId' is used as seen in the server.js response
    this.userId = this.route.snapshot.queryParamMap.get('userId');

    if (!this.userId) {
      this.error = 'Missing password reset identifier.';
    }
  }

  resetPassword(): void {
    this.error = null;
    this.success = null;

    if (!this.userId) {
      this.error = 'Cannot reset password: Missing user identifier.';
      return;
    }

    if (this.formData.newPassword !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    
    // Add userId to the payload
    const payload = {
        userId: this.userId,
        ...this.formData
    };

    this.authService.resetPassword(payload).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = response.message || 'Password updated successfully. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }
}