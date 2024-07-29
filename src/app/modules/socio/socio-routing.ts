import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/socio/socio.component').then(
        (c) => c.SocioComponent
      ),
  },
];

