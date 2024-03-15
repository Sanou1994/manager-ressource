import { Routes } from '@angular/router';

export const  routes: Routes = [
    {
      path: '',loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
      children: [
        {
          path: '',pathMatch: 'full', redirectTo: 'login'
        },
        { 
            path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) 
        },
        { 
           path: 'register-list', loadComponent: () => import('./register-list/register-list.component').then(m => m.RegisterListComponent) 
       },
        { 
            path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) 
        }
      ],
    },
  ];
