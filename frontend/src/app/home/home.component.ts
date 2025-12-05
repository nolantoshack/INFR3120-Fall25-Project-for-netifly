import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.component.html',
  styleUrls: ['../../css/style.css'],
})
export class HomeComponent implements OnInit {
  title = 'Welcome';
  User: User | null = null;
  activePage = 'home';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }
}