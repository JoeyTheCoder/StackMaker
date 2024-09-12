// team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamRequest } from '../models/team-request.model';
import { environment } from '../../environments/environment'; // Ensure the path is correct

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/create-teams`; // Updated with the environment variable

  constructor(private http: HttpClient) {}

  createTeams(request: TeamRequest): Observable<any> {
    console.log('Sending team request:', request); // Log the request for debugging
    return this.http.post<any>(this.apiUrl, request);
  }
}
