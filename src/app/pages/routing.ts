import { Routes } from '@angular/router';

let redirectToValue: string = '/empresa/lista';

function getRedirectTo(): string {
  // Aquí puedes agregar tu lógica para determinar el valor de redirección
  // basado en la variable o cualquier otra condición
  let dominioActual = window.location.host;
  let esSubdominio = dominioActual.split('.').length > 2;

  if (esSubdominio) {
    redirectToValue = '/dashboard';
  }
  return redirectToValue;
}

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
    data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
    data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: ':ruta',
    loadChildren: () =>
      import('../modules/general/general.module').then((m) => m.GeneralModule),
  },
  {
    path: 'empresa',
    loadChildren: () =>
      import('../modules/empresa/empresa.module').then((m) => m.EmpresaModule),
    data: { layout: 'dark-header' },
  },
  {
    path: '',
    redirectTo: getRedirectTo(),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
