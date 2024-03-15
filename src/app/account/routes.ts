import { Routes } from "@angular/router";
  export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('../home/home-acceuil.component').then(m => m.HomeAcceuilComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'auth/login'
        },        
        { 
            path: 'accounts', loadComponent: () => import('./account.component').then(m => m.AccountComponent) 
        }
      ],
    },
  ];