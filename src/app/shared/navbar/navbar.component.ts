import { Component, OnInit } from '@angular/core';
import { AccountServiceService } from 'src/app/services/account/account-service.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true
})
export class NavbarComponent implements OnInit {
  fullName:any
  userID:any
  constructor(private authService:AccountServiceService){}
  ngOnInit(): void 
  {

    this.fullName=localStorage.getItem("lastname") + " "+localStorage.getItem("firstname")
  }

  logout()
  {
    this.authService.logout()
  }

}
