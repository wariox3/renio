import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambioClaveComponent } from './componentes/cambio-clave/cambio-clave.component';

const routes: Routes = [
  {
    path: 'cambioclave',
    component: CambioClaveComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
