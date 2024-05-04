import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountServiceService } from 'src/app/services/account/account-service.service';
declare var $:any
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    imports:[CommonModule],
    standalone: true
})
export class NavbarComponent implements OnInit {
  fullName:any
  userID:any
  RoleUser:any

  constructor(private authService:AccountServiceService,private router: Router){}
  ngOnInit(): void 
  {

    this.fullName=localStorage.getItem("lastname") + " "+localStorage.getItem("firstname")
    this.RoleUser=localStorage.getItem("role");

  }

  logout()
  {
    this.authService.logout()
  }

  openClose()
  {
    const sidePanelToggler = document.getElementById('sidepanel-toggler'); 
    const sidePanel = document.getElementById('app-sidepanel'); 
		sidePanel?.classList.add('sidepanel-visible'); 

  /*  if (!!sidePanel && sidePanel.classList.contains('sidepanel-visible')) {
		sidePanel.classList.remove('sidepanel-visible');
		sidePanel.classList.add('sidepanel-hidden');
		
	} else {
		sidePanel?.classList.remove('sidepanel-hidden');
		sidePanel?.classList.add('sidepanel-visible');
	} */


  }

  isLinkActive(link:string) {
        
    const url = this.router.url;
    return url.includes(link);
  }

}
