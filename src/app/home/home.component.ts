import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TeamService } from '../services/team.service';
import { Player, TeamRequest } from '../models/team-request.model';
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
  teams: any[][] = [];  // Updated to handle multiple teams as arrays
  showTeams = false;
  attemptedSubmit = false;
  displayErrorMessage = false;
  errorMessage = '';
  ranks: string[] = [
    'Iron 4', 'Iron 3', 'Iron 2', 'Iron 1',
    'Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1',
    'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1',
    'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1',
    'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1',
    'Emerald 4', 'Emerald 3', 'Emerald 2', 'Emerald 1',
    'Diamond 4', 'Diamond 3', 'Diamond 2', 'Diamond 1',
    'Master', 'Grandmaster', 'Challenger'
  ];

  roles: string[] = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];

  constructor(private fb: FormBuilder, private teamService: TeamService) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
      teamMode: ['Balanced']
    });
  }

  ngOnInit() {
    this.loadForm();
    this.form.valueChanges.subscribe((value) => {
      localStorage.setItem('form', JSON.stringify(value));
    });

    console.log("StackMaker Frontend Version: 1.00");

    this.teamService.getGreeting().subscribe(
      (response: string) => {
        console.log('Greeting from FastAPI:', response); // Log the response to the console
      },
      (error) => {
        console.error('Error fetching greeting:', error); // Log any errors
      }
    );
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    this.attemptedSubmit = false;
    this.displayErrorMessage = false;
    this.rows.push(this.fb.group({
      name: ['', Validators.required],
      rank: ['', Validators.required],
      role1: ['', Validators.required],
      role2: '',
      notPlay: ''
    }));
  }

  deleteRow(index: number) {
    if (this.rows.length > 0) {
      this.rows.removeAt(index);
    }
  }

  deleteAllRows() {
    this.attemptedSubmit = false;
    this.displayErrorMessage = false;
    while (this.rows.length !== 0) {
      this.rows.removeAt(0);
    }
  }

  loadForm() {
    const storedForm = localStorage.getItem('form');
    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      this.form.setControl('rows', this.fb.array(
        parsedForm.rows.map((row: { name: string; rank: string; role1: string; role2: string; notPlay?: string; }) => {
          return this.fb.group({
            name: [row.name, Validators.required],
            rank: [row.rank, Validators.required],
            role1: [row.role1, Validators.required],
            role2: row.role2,
            notPlay: row.notPlay || ''
          });
        })
      ));
      this.form.patchValue({
        teamMode: parsedForm.teamMode || 'Balanced'
      });
    } else {
      this.addRow();
    }
  }

  createStack() {
    this.attemptedSubmit = true;
    this.displayErrorMessage = this.form.invalid;
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }

    const players: Player[] = this.form.value.rows.map((row: any) => ({
      name: row.name,
      rank: row.rank,
      role1: row.role1,
      role2: row.role2,
      cant_play: row.notPlay ? row.notPlay : null // Set cant_play to null if it's an empty string
    }));

    const teamMode = this.form.value.teamMode.toLowerCase();

    const teamRequest: TeamRequest = { players, roles: this.roles, mode: teamMode };

    this.teamService.createTeams(teamRequest).subscribe(
      (response: any) => {
        console.log('Received response:', response);
        if (response.error) {
          this.errorMessage = response.error;
          this.displayErrorMessage = true;
        } else {
          this.teams = response.teams;  // Updated to handle multiple teams
          this.showTeams = true;
        }
      },
      (error: any) => {
        console.error('Error creating teams:', error);
        this.errorMessage = 'An error occurred while creating teams. Please try again.';
        this.displayErrorMessage = true;
      }
    );
  }

  closeOverlay() {
    this.showTeams = false;
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
        return '../../assets/img/league_role_icons/top.webp';
    }
  }
}
