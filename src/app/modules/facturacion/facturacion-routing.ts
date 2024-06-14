import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/facturacion/facturacion.component').then(
        (c) => c.FacturacionComponent
      ),
  },
];

