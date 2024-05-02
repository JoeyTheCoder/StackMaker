import { Player } from "./player";

export class Team {
  players: Player[] = [];

  constructor(players: Player[]) {
    this.players = players;
  }

  hasRoleAvailable(role: string): boolean {
    return this.players.filter(player => player.role1 === role || player.role2 === role).length < 1;
  }

  hasPlayerWithRole(role: string): boolean {
    return this.players.some(player => player.role1 === role || player.role2 === role);
  }

  addPlayer(player: Player, role: string) {
    player.role1 = role;
    this.players.push(player);
  }

  getAvailableRole(): string {
    const roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
    for (let role of roles) {
      if (this.hasRoleAvailable(role)) {
        return role;
      }
    }
    return 'Top';  // oder irgendeine Standardrolle
  }

  playerCount(): number {
    return this.players.length;
  }
}