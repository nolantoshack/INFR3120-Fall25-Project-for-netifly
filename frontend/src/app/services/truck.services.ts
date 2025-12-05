import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Trip } from '../models/trip.models';

@Injectable({
  providedIn: 'root'
})
export class TrucksService {
  private apiUrl = '/api'; // Base API URL, assuming truck routes are prefixed with /api

  constructor(private http: HttpClient) { }

  getTrips(): Observable<Trip[] | any> {
    // Assuming the backend exposes a route to get all trips under /trucks
    return this.http.get<Trip[]>(`${this.apiUrl}/trucks`).pipe(
      catchError(error => {
        console.error('Error fetching trips:', error);
        return of({ error: error.error?.error || 'Failed to fetch trips.' });
      })
    );
  }

  getTripById(id: string): Observable<Trip | any> {
    // Assuming the backend exposes a route for single trip details
    return this.http.get<Trip>(`${this.apiUrl}/edit-trip/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching trip details:', error);
        return of({ error: error.error?.error || 'Failed to fetch trip details.' });
      })
    );
  }

  createTrip(tripData: Partial<Trip>): Observable<any> {
    // Assuming the create form posts to /create or /api/create
    return this.http.post(`${this.apiUrl}/create`, tripData).pipe(
      catchError(error => {
        console.error('Error creating trip:', error);
        return of({ error: error.error?.error || 'Failed to log new trip.' });
      })
    );
  }

  updateTrip(id: string, tripData: Partial<Trip>): Observable<any> {
    // Assuming the edit form PUTs to /edit-trip/:id
    return this.http.put(`${this.apiUrl}/edit-trip/${id}`, tripData).pipe(
      catchError(error => {
        console.error('Error updating trip:', error);
        return of({ error: error.error?.error || 'Failed to save changes.' });
      })
    );
  }

  deleteTrip(id: string): Observable<any> {
    // Assuming the delete action POSTs to /delete-trip/:id (as seen in EJS file)
    // Note: A DELETE request is more RESTful, but POST is used here to match your EJS/HTML forms
    return this.http.post(`${this.apiUrl}/delete-trip/${id}`, {}).pipe(
      catchError(error => {
        console.error('Error deleting trip:', error);
        return of({ error: error.error?.error || 'Failed to delete trip.' });
      })
    );
  }
}