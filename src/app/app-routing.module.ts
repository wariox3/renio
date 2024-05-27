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
    path: 'foro',
    component: LandingpageComponent,
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
