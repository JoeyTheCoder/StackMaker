// team-request.model.ts
export interface Player {
  name: string;
  rank: string; // Ensure rank is a string
  role1: string;
  role2: string;
  notPlay?: string;
}

export interface TeamRequest {
  players: Player[];
  roles: string[];
  mode: string; // Added mode to the request
}
