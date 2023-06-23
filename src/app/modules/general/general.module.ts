import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { ContactoListaComponent } from './components/contacto/contacto-lista/contacto-lista.component';
import { ContactoNuevoComponent } from './components/contacto/contacto-nuevo/contacto-nuevo.component';
import { ContactoEditarComponent } from './components/contacto/contacto-editar/contacto-editar.component';
import { ContactoDetalleComponent } from './components/contacto/contacto-detalle/contacto-detalle.component';


@NgModule({
  declarations: [
    ContactoListaComponent,
    ContactoNuevoComponent,
    ContactoEditarComponent,
    ContactoDetalleComponent
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule
  ]
})
export class GeneralModule { }
