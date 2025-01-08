import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/socio/socio.component').then(
        (c) => c.SocioComponent
      ),
  },
];

