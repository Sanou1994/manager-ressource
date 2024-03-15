import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',   redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../app/home/routes').then(m => m.routes) }, 
  {path: 'accounts', loadChildren: () => import('../app/account/routes').then(m => m.routes)},
  {path: 'auth', loadChildren: () => import('../app/auth/routes').then(m => m.routes)},
  { path: 'ressource', loadChildren: () => import('../app/ressource/routes').then(m => m.routes) },
  { path: 'assign', loadChildren: () => import('../app/assign/routes').then(m => m.routes) },
  { path: 'reservation', loadChildren: () => import('../app/reservation/routes').then(m => m.routes) },
  { path: '**', redirectTo: '/auth/login' },
  ];