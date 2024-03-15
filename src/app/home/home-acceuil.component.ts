import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './home-acceuil.component.html',
    styleUrls: ['./home-acceuil.component.css'],
    standalone: true,
    imports: [NavbarComponent, SidebarComponent, RouterOutlet]
})
export class HomeAcceuilComponent {
  title = 'manage-ressource';
}
