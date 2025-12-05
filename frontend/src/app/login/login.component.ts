import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class LoginComponent implements OnInit {
  title = 'Login';
  User: User | null = null;
  activePage = 'login';
  error: string | null = null;
  success: string | null = null;

  // Use ngModel for form data binding
  formData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }

  login(): void {
    this.error = null;
    this.success = null;

    this.authService.login(this.formData).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        // Assuming a successful login redirects to home or trucks
        this.router.navigate(['/trucks']);
      }
    });
  }
}