import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TeamService } from '../services/team.service'; // Import the service
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10%)' }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10%)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  checkboxForm: FormGroup;
  teams: any[] = []; // Add a property to hold the teams
  showTeams = false; // Add a property to control the visibility of the overlay

  constructor(private fb: FormBuilder, private teamService: TeamService, private library: FaIconLibrary) { // Inject the service
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
    this.checkboxForm = this.fb.group({
      clash: ['']
    });

    this.library.addIcons(faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight);
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
      notPlay: '' // Add the new field here
    }));
  }

  deleteRow(index: number) {
    if (this.rows.length > 0) {
      this.rows.removeAt(index);
    }
  }

  loadForm() {
    if (typeof localStorage !== 'undefined') {
      const storedForm = localStorage.getItem('form');
      if (storedForm) {
        const parsedForm = JSON.parse(storedForm);
        this.form = this.fb.group({
          rows: this.fb.array(
            parsedForm.rows.map((row: { name: string; rank: string; role1: string; role2: string; notPlay?: string; }) => {
              return this.fb.group({
                name: row.name,
                rank: row.rank,
                role1: row.role1,
                role2: row.role2,
                notPlay: row.notPlay || '' // Ensure notPlay is added with a default value if missing
              });
            })
          ),
        });
      } else {
        this.addRow();
      }
    }
  }

  createStack() {
    console.log(JSON.stringify(this.form.value));

    const rankMapping: { [key: string]: number } = {
      'Iron4': 1, 'Iron3': 2, 'Iron2': 3, 'Iron1': 4,
      'Bronze4': 5, 'Bronze3': 6, 'Bronze2': 7, 'Bronze1': 8,
      'Silver4': 9, 'Silver3': 10, 'Silver2': 11, 'Silver1': 12,
      'Gold4': 13, 'Gold3': 14, 'Gold2': 15, 'Gold1': 16,
      'Platinum4': 17, 'Platinum3': 18, 'Platinum2': 19, 'Platinum1': 20,
      'Emerald4': 21, 'Emerald3': 22, 'Emerald2': 23, 'Emerald1': 24,
      'Diamond4': 25, 'Diamond3': 26, 'Diamond2': 27, 'Diamond1': 28,
      'Master': 29, 'Grandmaster': 30, 'Challenger': 31
    };

    const roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support']; // Define roles
    const players = this.form.value.rows.map((row: any) => ({
      name: row.name,
      rank: rankMapping[row.rank], // Convert rank to numeric value
      role1: row.role1,
      role2: row.role2,
      notPlay: row.notPlay // Add the new field here
    }));

    this.teamService.createTeams({ players, roles }).subscribe(
      (teams: any) => {
        this.teams = [teams.team1, teams.team2]; // Update the teams property
        this.showTeams = true; // Show the overlay when teams are created
      },
      (error: any) => { // Specify the type of error
        console.error('Error creating teams:', error);
      }
    );
  }

  closeOverlay() {
    this.showTeams = false; // Close the overlay
  }

  getRoleIcon(roleIndex: number) {
    switch (roleIndex) {
      case 0:
        return 'fas fa-chess-king';
      case 1:
        return 'fas fa-chess-queen';
      case 2:
        return 'fas fa-chess-rook';
      case 3:
        return 'fas fa-chess-bishop';
      case 4:
        return 'fas fa-chess-knight';
      default:
        return 'fas fa-chess-king'; // Default icon if index is out of bounds
    }
  }
}
