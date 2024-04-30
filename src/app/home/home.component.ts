import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: FormGroup = this.fb.group({
    rows: this.fb.array([])
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addRow();
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      name: '',
      rank: '',
      role1: '',
      role2: ''
    });

    this.rows.push(row);
  }
}