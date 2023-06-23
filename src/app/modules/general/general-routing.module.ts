import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoListaComponent } from './componentes/contacto/contacto-lista/contacto-lista.component';
import { ContactoNuevoComponent } from './componentes/contacto/contacto-nuevo/contacto-nuevo.component';
import { ContactoEditarComponent } from './componentes/contacto/contacto-editar/contacto-editar.component';
import { ContactoDetalleComponent } from './componentes/contacto/contacto-detalle/contacto-detalle.component';

const routes: Routes = [
  {
    path: 'administracion',
    children: [
      {
        path: 'contacto',
        children: [
          {
            path: 'lista',
            component: ContactoListaComponent,
          },
          {
            path: 'nuevo',
            component: ContactoNuevoComponent,
          },
          {
            path: 'editar/:id',
            component: ContactoEditarComponent
          },
          {
            path: 'detalle/:id',
            component: ContactoDetalleComponent
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
