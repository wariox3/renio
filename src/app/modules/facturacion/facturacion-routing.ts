import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/facturacion/facturacion.component').then(
        (c) => c.FacturacionComponent
      ),
  },
];

