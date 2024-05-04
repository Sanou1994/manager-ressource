import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
declare var $:any
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports:[CommonModule],
    standalone: true
})
export class SidebarComponent implements  OnInit,OnChanges {
    RoleUser:any
    constructor(private router: Router){} // add to constructor
    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnInit(): void {
       
        this.RoleUser=localStorage.getItem("role");

    }
    isLinkActive(link:string) {
        
        const url = this.router.url;
        return url.includes(link);
      }
       
       
}
