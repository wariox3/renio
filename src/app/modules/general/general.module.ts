import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { ContactoListaComponent } from './componentes/contacto/contacto-lista/contacto-lista.component';
import { ContactoNuevoComponent } from './componentes/contacto/contacto-nuevo/contacto-nuevo.component';
import { ContactoEditarComponent } from './componentes/contacto/contacto-editar/contacto-editar.component';
import { ContactoDetalleComponent } from './componentes/contacto/contacto-detalle/contacto-detalle.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ItemListaComponent } from './componentes/item/item-lista/item-lista.component';
import { ItemNuevoComponent } from './componentes/item/item-nuevo/item-nuevo.component';
import { ItemDetalleComponent } from './componentes/item/item-detalle/item-detalle.component';
import { ItemEditarComponent } from './componentes/item/item-editar/item-editar.component';
import { BaseListaComponent } from '@comun/componentes/base-lista/base-lista.component';
import { BaseNuevoComponent } from '@comun/componentes/base-nuevo/base-nuevo.component';
import { BaseDetalleComponent } from '@comun/componentes/base-detalle/base-detalle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemFormularioComponent } from './componentes/item/item-formulario/item-formulario.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';


@NgModule({
  declarations: [
    ContactoListaComponent,
    ContactoNuevoComponent,
    ContactoEditarComponent,
    ContactoDetalleComponent,
    ItemListaComponent,
    ItemNuevoComponent,
    ItemDetalleComponent,
    ItemEditarComponent,
    ItemFormularioComponent
  ],
  imports: [
    BaseListaComponent,
    BaseNuevoComponent,
    BaseDetalleComponent,
    CommonModule,
    GeneralRoutingModule,
    TablaComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
  ]
})
export class GeneralModule { }
