import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Player {
  name: string;
  rank: number; // Make sure rank is of type number
  role1: string;
  role2: string;
}

interface TeamRequest {
  players: Player[];
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8000/create-teams'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  createTeams(request: TeamRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
}
