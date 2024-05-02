import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Team } from '../classes/team';
import { Player } from '../classes/player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  teams: Player[][] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadForm();
    this.form.valueChanges.subscribe((value) => {
      localStorage.setItem('form', JSON.stringify(value));
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    this.rows.push(this.fb.group({
      name: '',
      rank: '',
      role1: '',
      role2: '',
    }));
  }

  deleteRow() {
    if (this.rows.length > 0) {
      this.rows.removeAt(this.rows.length - 1);
    }
  }

  loadForm() {
    const storedForm = localStorage.getItem('form');
    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      this.form = this.fb.group({
        rows: this.fb.array(
          parsedForm.rows.map((row: { name: string; rank: string; role1: string; role2: string; }) => this.fb.group(row))
        ),
      });
    } else {
      this.addRow();
    }
  }

  createStack() {
    console.log(JSON.stringify(this.form.value));
    const players = this.rows.value.map((row: { name: string; rank: string; role1: string; role2: string; preference: number; }) => new Player(row.name, row.rank, row.role1, row.role2, row.preference));
    this.teams = this.assignPlayersToTeams(players);
  }



  assignPlayersToTeams(players: Player[]): Player[][] {
    const roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
    const teams: Player[][] = [[], []];
  
    for (let i = 0; i < 2; i++) {
      for (let role of roles) {
        let player = players.find(player => !player.assigned && (player.role1 === role || player.role2 === role));
        if (player) {
          teams[i].push(player);
          player.assigned = true;
          player.assignedRole = role; 
        }
      }
    }
  
    let unassignedPlayers = players.filter(player => !player.assigned);
    for (let i = 0; i < unassignedPlayers.length; i++) {
      let teamIndex = i % 2;
      teams[teamIndex].push(unassignedPlayers[i]);
      unassignedPlayers[i].assigned = true;
    }
  
    return teams;
  }
  areAllRolesFilled(team: Team): boolean {
    let roles = ['role1', 'role2', 'role3', 'role4', 'role5'];
    return roles.every(role => team.hasPlayerWithRole(role));

  }

  getSortedPlayersForTeam(teamIndex: number): Player[] {
    return this.teams[teamIndex].sort((a, b) => a.preference - b.preference);
  }
}