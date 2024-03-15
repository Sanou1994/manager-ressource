import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, KeyValuePipe, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
declare var $:any

@Component({
  selector: 'app-account-search',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NgFor, KeyValuePipe],
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements  OnInit {
 

  form!: FormGroup;

  @Output() SearchFilter: EventEmitter<any> = new EventEmitter<any[]>();
  @Output() ResetFormSearch: EventEmitter<any> = new EventEmitter<any>();
  searchForm!: FormGroup;
  AllCity: any[] = [];
  AllSexe: any[] = [];
  AllInsurances:any[]=[]

  config: any;

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {

    this.searchForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      doB: new FormControl(),
      patientIdentifier: new FormControl(),
      nidIdentifier: new FormControl(),
      createdDate: new FormControl(),
      middleName: new FormControl(),
      sex: new FormControl(),     
      phone: new FormControl(),
      insuranceId: new FormControl(),
      city: new FormControl(),
      tz: new FormControl(),
      gender: new FormControl(),
      inactive: new FormControl()
    });    

  }



  onRechercheSubmit() {
    if (
      !!!this.searchForm.value.firstName  &&
      !!!this.searchForm.value.lastName  &&
      !!!this.searchForm.value.patientIdentifier &&
      !!!this.searchForm.value.doB &&
      !!!this.searchForm.value.phone &&
      !!!this.searchForm.value.createdDate &&
      !!!this.searchForm.value.sex  &&
      !!!this.searchForm.value.insuranceId &&
      !!!this.searchForm.value.city 
    )
     {
      
      $("#formSearchNotCriteria").modal('show')

    }
    else
     {

      this.searchForm.value.doB= (new Date(this.searchForm.value.doB).getTime())
      this.searchForm.value.createdDate= (new Date(this.searchForm.value.createdDate).getTime())
      this.SearchFilter.emit(this.searchForm.value);

      
    }
  }


  annuler()
   {

    this.searchForm.reset()
    this.ResetFormSearch.emit(new Date().getTime());

  }



}
