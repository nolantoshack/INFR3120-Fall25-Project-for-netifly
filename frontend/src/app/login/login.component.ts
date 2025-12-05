import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['../../css/form_style.css'], 
})
export class LoginComponent implements OnInit {
  title = 'Login';
  User: User | null = null;
  activePage = 'login';
  error: string | null = null;
  success: string | null = null;

  formData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      //Redirect already logged-in users
      if (this.User) {
        this.router.navigate(['/']); 
      }
    });
  }

  login(): void {
    this.error = null;
    this.success = null;

    this.authService.login(this.formData).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Login successful!';
        this.router.navigate(['/']); 
      }
    });
  }
}