export class Player {
  name: string;
  rank: string;
  role1: string;
  role2: string;
  preference: number; // Fügen Sie diese Zeile hinzu
  assigned: boolean;
  assignedRole: string;

  constructor(name: string, rank: string, role1: string, role2: string, preference: number) { // Fügen Sie preference als Argument hinzu
    this.name = name;
    this.rank = rank;
    this.role1 = role1;
    this.role2 = role2;
    this.preference = preference; // Fügen Sie diese Zeile hinzu
    this.assigned = false;
    this.assignedRole = '';
  }
}