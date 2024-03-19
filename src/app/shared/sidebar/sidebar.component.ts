import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports:[CommonModule],
    standalone: true
})
export class SidebarComponent implements  OnInit {
    RoleUser:any
    constructor(private router: Router){} // add to constructor

    ngOnInit(): void {
       
        this.RoleUser=localStorage.getItem("role");

    }
    isLinkActive(link:string) {
        const url = this.router.url;
        return url.includes(link);
      }
}
