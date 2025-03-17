import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutentificacionGuard } from '@guardias/auth.guard';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: LandingpageComponent,
  },
  {
    path: 'faqs',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'terminos',
    loadComponent: () =>
      import('./pages/terminos/terminos.component').then(
        (c) => c.TerminosComponent
      ),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'cambios',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'tutoriales',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'ayuda',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'acerca_de',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'comprar',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'soporte',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-compras-ventas',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-tesoreria-cartera',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-inventario',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-pos',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-nomina',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'informacion-contabilidad',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'foro',
    loadComponent: () =>
      import('./pages/contruccion/contruccion.component').then(
        (c) => c.ContruccionComponent
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AutentificacionGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
