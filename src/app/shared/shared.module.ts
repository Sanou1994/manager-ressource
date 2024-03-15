import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoaderComponent } from './loader/loader.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SidebarComponent,
        LoaderComponent,
        NavbarComponent
    ],
    exports: [
        SidebarComponent,
        LoaderComponent,
        NavbarComponent
    ]
})
export class SharedModule { }
