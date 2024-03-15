import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    imports:[CommonModule],
    standalone: true
})
export class SidebarComponent implements  OnInit {
    RoleUser:any
    ngOnInit(): void {
       
        this.RoleUser=localStorage.getItem("role");

    }

}
