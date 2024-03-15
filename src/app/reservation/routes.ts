import { Routes } from '@angular/router';

export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('../home/home-acceuil.component').then(m => m.HomeAcceuilComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'dashboard'
        },
        { 
            path: 'dashboard', loadComponent: () => import('./reservation.component').then(m => m.ReservationComponent) 
        },
        { 
            path: 'update/:id', loadComponent: () => import('./update/update.component').then(m => m.UpdateComponent) 
        },
        { 
            path: 'create/:id', loadComponent: () => import('./create/create.component').then(m => m.CreateComponent) 
        },
        { 
            path: 'detail/:id', loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent) 
        },
        { 
            path: 'list', loadComponent: () => import('./list/list.component').then(m => m.ListComponent) 
        }
      ],
    },
  ];