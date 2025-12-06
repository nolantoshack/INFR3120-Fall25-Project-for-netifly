import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.models'; 

// Define the shape of the data for login
interface LoginPayload {
  email: string;
  password: string;
}

// Define the shape of the data for registration 
interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'Driver' | 'Dispatcher' | 'Admin';
}

// Define the shape of the data for password reset
interface PasswordResetPayload {
  newPassword: string;
  confirmPassword: string;
}

// Define a common response structure for API calls
interface MessageResponse {
  message?: string;
  error?: string;
  user?: User; // Returned on successful login/signup
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Base API URL for  backend routes
  private userSource = new BehaviorSubject<User | null>(null);
  
  // Public observable for components to subscribe to
  currentUser = this.userSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromSession();
  }

  // Load user from local storage on service initialization
  private loadUserFromSession(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user: User = JSON.parse(userJson);
        this.userSource.next(user);
      } catch (e) {
        console.error("Error parsing user from session:", e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Helper to save user to session/local storage
  private saveUserToSession(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSource.next(user);
  }

  // User Login API call
  login(formData: LoginPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/login`, formData).pipe(
      tap(response => {
        if (response.user) {
          this.saveUserToSession(response.user);
        }
      }),
      catchError(error => {
        // Return a clean error object for the component to handle
        return of({ error: error.error?.error || 'Login failed.' });
      })
    );
  }

  // User Sign Up API call
  signUp(formData: RegistrationPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/signup`, formData).pipe(
      tap(response => {
        if (response.user) {
          this.saveUserToSession(response.user);
        }
      }),
      catchError(error => {
        return of({ error: error.error?.error || 'Registration failed.' });
      })
    );
  }
  
  // Logout function
  logout(): void {
    // Send a request to the backend to clear the session/cookie on the backend
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

  // Initiates the forgot password process by sending an email address.
  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Failed to process request.' });
      })
    );
  }

  // Resets the user's password using the token 
  resetPassword(token: string | null, formData: PasswordResetPayload): Observable<MessageResponse> {
    if (!token) {
        return of({ error: 'Missing password reset token.' });
    }

    const payload = {
        userId: token, 
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
    };

    // Send the password reset request
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, payload).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Failed to update password.' });
      })
    );
  }
}