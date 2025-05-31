import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'detalhes', loadComponent: () => import('./components/detalhes/detalhes.component').then(m => m.DetalhesComponent) }
];
