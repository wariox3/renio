import { Route } from '@angular/router';
import { ContenedorListaComponent } from './paginas/contenedor-lista/contenedor-lista.component';
import { ContenedorNuevoComponent } from './paginas/contenedor-nuevo/contenedor-nuevo.component';
import { ContenedorDetalleComponent } from './paginas/contenedor-detalle/contenedor-detalle.component';

import { ContenedorInvitacionComponent } from './paginas/contenedor-invitacion/contenedor-invitacion.component';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: ContenedorListaComponent,
  },
  {
    path: 'nuevo',
    component: ContenedorNuevoComponent,
  },
  {
    path: 'detalle/:contenedorCodigo',
    component: ContenedorDetalleComponent,
    children: [
      {
        path: '', // Ruta vacía, se inicia por defecto cuando se carga la ruta padre
        redirectTo: 'facturacion',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: ':contenedorNombre/:contenedorCodigo/invitacion/nuevo',
    component: ContenedorInvitacionComponent,
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
