import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Trip } from '../models/trip.models';

@Injectable({
  providedIn: 'root'
})
export class TrucksService {
  private apiUrl = '/api'; // Base API URL

  constructor(private http: HttpClient) { }

  getTrips(): Observable<Trip[] | any> {
    return this.http.get<Trip[]>(`${this.apiUrl}/trucks`).pipe(
      catchError(error => {
        console.error('Error fetching trips:', error);
        return of({ error: error.error?.error || 'Failed to fetch trips.' });
      })
    );
  }

  getTripById(id: string): Observable<Trip | any> {
    return this.http.get<Trip>(`${this.apiUrl}/edit-trip/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching trip details:', error);
        return of({ error: error.error?.error || 'Failed to fetch trip details.' });
      })
    );
  }

  createTrip(tripData: Partial<Trip>): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, tripData).pipe(
      catchError(error => {
        console.error('Error creating trip:', error);
        return of({ error: error.error?.error || 'Failed to log new trip.' });
      })
    );
  }

  updateTrip(id: string, tripData: Partial<Trip>): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-trip/${id}`, tripData).pipe(
      catchError(error => {
        console.error('Error updating trip:', error);
        return of({ error: error.error?.error || 'Failed to save changes.' });
      })
    );
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-trip/${id}`, {}).pipe(
      catchError(error => {
        console.error('Error deleting trip:', error);
        return of({ error: error.error?.error || 'Failed to delete trip.' });
      })
    );
  }
}