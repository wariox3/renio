import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { ContactoListaComponent } from './componentes/contacto/contacto-lista/contacto-lista.component';
import { ContactoEditarComponent } from './componentes/contacto/contacto-editar/contacto-editar.component';
import { ContactoDetalleComponent } from './componentes/contacto/contacto-detalle/contacto-detalle.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ItemListaComponent } from './componentes/item/item-lista/item-lista.component';
import { ItemEditarComponent } from './componentes/item/item-editar/item-editar.component';
import { BaseListaComponent } from '@comun/componentes/base-lista/base-lista.component';
import { BaseDetalleComponent } from '@comun/componentes/base-detalle/base-detalle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ContactoFormularioComponent } from './componentes/contacto/contacto-formulario/contacto-formulario.component';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImportarComponent } from '@comun/componentes/importar/importar.component';

@NgModule({
  declarations: [
    ContactoListaComponent,
    ContactoEditarComponent,
    ContactoDetalleComponent,
    ItemListaComponent,
    ItemEditarComponent,
    ContactoFormularioComponent,
  ],
  imports: [
    BaseListaComponent,
    BaseDetalleComponent,
    BaseFiltroComponent,
    CommonModule,
    GeneralRoutingModule,
    TablaComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    CardComponent,
    ImportarComponent,
  ],
})
export class GeneralModule {}
