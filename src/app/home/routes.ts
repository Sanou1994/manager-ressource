import { Routes } from '@angular/router';

export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('./home-acceuil.component').then(m => m.HomeAcceuilComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'login'
        },
        { 
            path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) 
        }
      ],
    },
  ];

  