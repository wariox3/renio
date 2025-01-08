import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  // {
  //   path: 'movimiento',
  //   loadComponent: () => import('./componentes/independientes/movimiento/movimiento-lista/movimiento-lista.component').then((c)=> c.MovimientoListaComponent)
  // },
  {
    path: 'guia',
    loadComponent: () => import('./paginas/independientes/guia/guia-lista/guia-lista.component').then((c)=> c.GuiaListaComponent)
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
