import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountSearchComponent } from './account-search/account-search.component';
import { AccountListComponent } from './account-list/account-list.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: true,
    imports: [AccountSearchComponent, AccountListComponent,NgIf]

})
export class AccountComponent implements OnInit {
  privileges:string[]=[]

  searchData:any
  resetSearch:any

  ngOnInit(): void {
  }


  getSearchData(event:any)
  {
    this.searchData=event

  }
  resetSearchData(event:any)
  {
    this.resetSearch=event

  }
}

