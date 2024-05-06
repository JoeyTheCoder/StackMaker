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
  checkboxForm: FormGroup;
  teams: Team[] = []; // Änderung hier
  players: Player[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
 
      rows: this.fb.array([]),
    });
    this.checkboxForm = this.fb.group({
      clash: ['']
    });
  }

  ngOnInit() {
 
  
    this.form.addControl('clash', this.fb.control(''));
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
    if (typeof localStorage !== 'undefined') {
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
  }

  createStack() {
    console.log(JSON.stringify(this.form.value));
  
    // Umwandeln der Formulardaten in Player-Objekte
    this.players = this.form.value.rows.map((row: any) => new Player(row.name, row.rank, row.role1, row.role2, row.preference));
  
    this.assignPlayersToTeams();
  }



  assignPlayersToTeams() {
    // Definieren Sie die Rollen und Ränge
    const roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
    const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'];
  
    // Sortieren Sie die Spieler nach Rang und Präferenz
    this.players.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank) || a.preference - b.preference);
  
    // Erstellen Sie zwei Teams
    const team1 = new Team([]);
    const team2 = new Team([]);
  
    // Weisen Sie die Spieler den Teams zu
    this.players.forEach(player => {
      // Prüfen Sie, welches Team die bevorzugte Rolle des Spielers verfügbar hat
      if (team1.hasRoleAvailable(player.role1) && !team1.hasPlayerWithRole(player.role1)) {
        team1.addPlayer(player, player.role1);
      } else if (team2.hasRoleAvailable(player.role1) && !team2.hasPlayerWithRole(player.role1)) {
        team2.addPlayer(player, player.role1);
      } else if (team1.hasRoleAvailable(player.role2) && !team1.hasPlayerWithRole(player.role2)) {
        team1.addPlayer(player, player.role2);
      } else if (team2.hasRoleAvailable(player.role2) && !team2.hasPlayerWithRole(player.role2)) {
        team2.addPlayer(player, player.role2);
      } else {
        // Wenn keine der bevorzugten Rollen verfügbar ist, weisen Sie dem Spieler eine verfügbare Rolle zu
        const role = team1.playerCount() < team2.playerCount() ? team1.getAvailableRole() : team2.getAvailableRole();
        if (team1.playerCount() < team2.playerCount()) {
          team1.addPlayer(player, role);
        } else {
          team2.addPlayer(player, role);
        }
      }
    });
  
    // Speichern Sie die Teams in der Komponentenklasse
    this.teams = [team1, team2];
  }
  
  areAllRolesFilled(team: Team): boolean {
    let roles = ['role1', 'role2', 'role3', 'role4', 'role5'];
    return roles.every(role => team.hasPlayerWithRole(role));
  }
  
  getSortedPlayersForTeam(teamIndex: number): Player[] {
    return this.teams[teamIndex].players.sort((a, b) => a.preference - b.preference); // Änderung hier
  }
}