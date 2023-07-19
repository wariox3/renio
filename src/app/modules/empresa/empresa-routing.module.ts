import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaComponent } from './componentes/empresa-lista/empresa.component';
import { EmpresaNuevoComponent } from './componentes/empresa-nuevo/empresa-nuevo.component';
import { EmpresaInvitacionComponent } from './componentes/empresa-invitacion/empresa-invitacion.component';
import { EmpresaDetalleComponent } from './componentes/empresa-detalle/empresa-detalle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: EmpresaComponent,
  },
  {
    path: 'nuevo',
    component: EmpresaNuevoComponent,
  },
  {
    path: 'detalle/:codigoempresa',
    component: EmpresaDetalleComponent,
  },
  {
    path: ':nombreempresa/:codigoempresa/invitacion/nuevo',
    component: EmpresaInvitacionComponent,
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
