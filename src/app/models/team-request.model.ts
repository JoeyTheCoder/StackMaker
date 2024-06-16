export interface TeamRequest {
  players: Player[];
  roles: string[];
  mode: string;
}

export interface Player {
  name: string;
  rank: number;
  role1: string;
  role2: string;
  notPlay: string;
}