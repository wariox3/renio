import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquilinoListaComponent } from './componentes/inquilino-lista/inquilino-lista.component';
import { InquilinoNuevoComponent } from './componentes/inquilino-nuevo/inquilino-nuevo.component';
import { InquilinoInvitacionComponent } from './componentes/inquilino-invitacion/inquilino-invitacion.component';
import { InquilinoDetalleComponent } from './componentes/inquilino-detalle/inquilino-detalle.component';
import { InquilinoFacturacionComponent } from './componentes/inquilino-facturacion/inquilino-facturacion.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: InquilinoListaComponent,
  },
  {
    path: 'nuevo',
    component: InquilinoNuevoComponent,
  },
  {
    path: 'detalle/:inquinoCodigo',
    component: InquilinoDetalleComponent,
    children: [
      {
        path: '', // Ruta vacía, se inicia por defecto cuando se carga la ruta padre
        redirectTo: 'facturacion',
        pathMatch: 'full',
      },
      {
        path: 'facturacion',
        component: InquilinoFacturacionComponent,
      },
    ],
  },
  {
    path: ':inquilinoNombre/:inquinoCodigo/invitacion/nuevo',
    component: InquilinoInvitacionComponent,
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRoutingModule {}
