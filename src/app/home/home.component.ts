import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form: FormGroup = this.fb.group({
    rows: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  sortedStack1: any[] = [];
  sortedStack2: any[] = [];

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const storedForm = localStorage.getItem('form');
      if (storedForm) {
        const parsedForm = JSON.parse(storedForm);
        this.form = this.fb.group({
          rows: this.fb.array(
            parsedForm.rows.map(
              (row: {
                name: string;
                rank: string;
                role1: string;
                role2: string;
              }) => this.fb.group(row)
            )
          ),
        });
      } else {
        this.addRow();
      }

      this.form.valueChanges.subscribe((value) => {
        localStorage.setItem('form', JSON.stringify(value));
      });
    }
    if (this.rows.length === 0) {
      this.addRow();
    }
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      name: '',
      rank: '',
      role1: '',
      role2: '',
    });

    this.rows.push(row);
  }

  deleteRow() {
    if (this.rows.length > 0) {
      this.rows.removeAt(this.rows.length - 1);
    }
  }

  createStack() {
    let stack = [];
    let stack2 = [];

      for (let i = 0; i < this.rows.length; i++) {
        if(i < 5){
          stack.push(this.rows.at(i).value);
        }
        else{
          stack2.push(this.rows.at(i).value);
        }
      }
      this.sortedStack1 = stack;
      this.sortedStack2 = stack2;
    }

  
}
