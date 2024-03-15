import { Routes } from '@angular/router';

export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('../home/home-acceuil.component').then(m => m.HomeAcceuilComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'dashboard'
        },
        { 
            path: 'dashboard', loadComponent: () => import('./assign.component').then(m => m.AssignComponent) 
        },
        { 
            path: 'update/:id', loadComponent: () => import('./update/update.component').then(m => m.UpdateComponent) 
        },
        { 
            path: 'temporaly/:id', loadComponent: () => import('./create-temporaly/create-temporaly.component').then(m => m.CreateTemporalyComponent) 
        },
        { 
          path: 'temporaly/given/:id', loadComponent: () => import('./given-temporaly/given-temporaly.component').then(m => m.GivenTemporalyComponent) 
        },    
        { 
            path: 'untemporaly/:id', loadComponent: () => import('./create-untemporaly/create-untemporaly.component').then(m => m.CreateUntemporalyComponent) 
        },
        { 
            path: 'detail/:id', loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent) 
        },
        { 
          path: 'detail-definitely/:id', loadComponent: () => import('./detail-untemporaly/detail-untemporaly.component').then(m => m.DetailUntemporalyComponent) 
      },
        { 
            path: 'list', loadComponent: () => import('./list/list.component').then(m => m.ListComponent) 
        }
      ],
    },
  ];