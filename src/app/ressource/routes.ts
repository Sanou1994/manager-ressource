import { Routes } from '@angular/router';

export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('../home/home-acceuil.component').then(m => m.HomeAcceuilComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'dashboard'
        },
        { 
            path: 'dashboard', loadComponent: () => import('./ressource.component').then(m => m.RessourceComponent) 
        },
        { 
            path: 'update/:id', loadComponent: () => import('./update/update.component').then(m => m.UpdateComponent) 
        },
        { 
            path: 'create', loadComponent: () => import('./create/create.component').then(m => m.CreateComponent) 
        },
        { 
          path: 'create-type-ressource', loadComponent: () => import('./typeressource/typeressource.component').then(m => m.TyperessourceComponent) 
        },
        { 
          path: 'create-type-ressource/:id', loadComponent: () => import('./typeressource/typeressource.component').then(m => m.TyperessourceComponent) 
        },
        { 
          path: 'type-ressources', loadComponent: () => import('./list-typeressource/list-typeressource.component').then(m => m.ListTyperessourceComponent) 
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