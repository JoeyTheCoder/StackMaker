// team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamRequest } from '../models/team-request.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8000/create-teams'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  createTeams(request: TeamRequest): Observable<any> {
    console.log('Sending team request:', request); // Log the request for debugging
    return this.http.post<any>(this.apiUrl, request);
  }
}
