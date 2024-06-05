import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TeamService } from '../services/team.service'; // Import the service

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  checkboxForm: FormGroup;
  teams: any[] = []; // Add a property to hold the teams

  constructor(private fb: FormBuilder, private teamService: TeamService) { // Inject the service
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

    const rankMapping: { [key: string]: number } = {
      'Iron4': 1, 'Iron3': 2, 'Iron2': 3, 'Iron1': 4,
      'Bronze4': 5, 'Bronze3': 6, 'Bronze2': 7, 'Bronze1': 8,
      'Silver4': 9, 'Silver3': 10, 'Silver2': 11, 'Silver1': 12,
      'Gold4': 13, 'Gold3': 14, 'Gold2': 15, 'Gold1': 16,
      'Platinum4': 17, 'Platinum3': 18, 'Platinum2': 19, 'Platinum1': 20,
      'Diamond4': 21, 'Diamond3': 22, 'Diamond2': 23, 'Diamond1': 24,
      'Master': 25, 'Grandmaster': 26, 'Challenger': 27
    };

    const roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support']; // Define roles
    const players = this.form.value.rows.map((row: any) => ({
      name: row.name,
      rank: rankMapping[row.rank], // Convert rank to numeric value
      role1: row.role1,
      role2: row.role2
    }));

    this.teamService.createTeams({ players, roles }).subscribe(
      (teams: any) => {
        this.teams = [teams.team1, teams.team2]; // Update the teams property
      },
      (error: any) => { // Specify the type of error
        console.error('Error creating teams:', error);
      }
    );
  }
}
