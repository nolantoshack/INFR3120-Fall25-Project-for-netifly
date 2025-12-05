// src/app/sign-up/sign-up.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.services';
import { User, RegistrationPayload, AuthResponse } from '../models/user.models'; 

@Component({
  selector: 'app-sign-up',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../css/form_style.css'],
})
export class SignUpComponent implements OnInit {
  title = 'Register';
  User: User | null = null;
  activePage = 'signup';
  error: string | null = null;
  success: string | null = null;

  formData: RegistrationPayload = {
    fullName: '',
    email: '',
    password: '',
    role: 'Driver',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (this.User) {
        this.router.navigate(['/']); 
      }
    });
  }

  register(): void {
    this.error = null;
    this.success = null;

    if (this.formData.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    this.authService.signUp(this.formData).subscribe((response: AuthResponse) => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Registration successful! Redirecting to login...';
        this.router.navigate(['/']); 
      }
    });
  }
}