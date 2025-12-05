import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Base API URL for your backend routes
  private userSource = new BehaviorSubject<User | null>(null);
  currentUser = this.userSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromSession();
  }

  // Load user from a session check or local storage (if applicable)
  // **Note**: In a real app, this should call an endpoint like /api/current-user
  private loadUserFromSession(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.userSource.next(JSON.parse(userJson));
    }
  }

  get User(): User | null {
    return this.userSource.value;
  }

  login(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, formData).pipe(
      tap((response: any) => {
        const user: User = response.user;
        this.userSource.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(error => {
        // Pass error message from the backend
        return of({ error: error.error?.error || 'Login failed.' });
      })
    );
  }

  register(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, formData).pipe(
      tap((response: any) => {
        // After successful registration, the backend usually logs the user in.
        // Assuming the response includes a user object:
        const user: User = response.user;
        this.userSource.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(error => {
        return of({ error: error.error?.error || 'Registration failed.' });
      })
    );
  }

  logout(): void {
    // Invalidate the session on the backend
    this.http.get(`${this.apiUrl}/logout`).subscribe({
      next: () => {
        this.userSource.next(null);
        localStorage.removeItem('currentUser');
      },
      error: () => {
        // Even if logout API fails, clear client side session
        this.userSource.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Failed to process request.' });
      })
    );
  }

  resetPassword(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, formData).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Failed to reset password.' });
      })
    );
  }
}