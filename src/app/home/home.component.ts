// home.component.ts
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
  teams: any[] = [];
  showTeams = false;
  attemptedSubmit = false;
  displayErrorMessage = false;
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
      teamMode: ['Balanced']
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
      notPlay: row.notPlay
    }));

    const teamRequest: TeamRequest = { players, roles: this.roles, mode: this.form.value.teamMode };

    this.teamService.createTeams(teamRequest).subscribe(
      (response: any) => {
        console.log('Received response:', response); // Log the response
        this.teams = response.teams;
        this.showTeams = true;
      },
      (error: any) => {
        console.error('Error creating teams:', error);
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
