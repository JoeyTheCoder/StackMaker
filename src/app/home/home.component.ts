import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TeamService } from '../services/team.service';
import { TeamRequest, Player } from '../models/team-request.model'; // Import the interface
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  teams: any[] = [];
  showTeams = false;
  ranks: string[] = [
    'Iron4', 'Iron3', 'Iron2', 'Iron1',
    'Bronze4', 'Bronze3', 'Bronze2', 'Bronze1',
    'Silver4', 'Silver3', 'Silver2', 'Silver1',
    'Gold4', 'Gold3', 'Gold2', 'Gold1',
    'Platinum4', 'Platinum3', 'Platinum2', 'Platinum1',
    'Emerald4', 'Emerald3', 'Emerald2', 'Emerald1',
    'Diamond4', 'Diamond3', 'Diamond2', 'Diamond1',
    'Master', 'Grandmaster', 'Challenger'
  ];
  roles: string[] = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];

  constructor(private fb: FormBuilder, private teamService: TeamService) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
      teamMode: ['Balanced'] // Add the teamMode control with a default value
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
          teamMode: [parsedForm.teamMode || 'Balanced'] // Ensure teamMode is added with a default value if missing
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

    const roles = this.roles; // Define roles
    const players: Player[] = this.form.value.rows.map((row: any) => ({
      name: row.name,
      rank: row.rank,
      role1: row.role1,
      role2: row.role2,
      notPlay: row.notPlay // Add the new field here
    }));

    const teamRequest: TeamRequest = { players, roles, mode: this.form.value.teamMode }; // Create request object

    this.teamService.createTeams(teamRequest).subscribe(
      (response: any) => {
        this.teams = response.teams; // Update the teams property
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

  getRoleIcon(role: string) {
    switch (role) {
      case 'Top':
        return '../../assets/img/league_role_icons/top.webp';
      case 'Jungle':
        return '../../assets/img/league_role_icons/jungle.webp';
      case 'Mid':
        return '../../assets/img/league_role_icons/mid.webp';
      case 'Adc':
        return '../../assets/img/league_role_icons/adc.webp';
      case 'Support':
        return '../../assets/img/league_role_icons/support.webp';
      default:
        return '../../assets/img/league_role_icons/top.webp'; // Default icon if role is not recognized
    }
  }
}
