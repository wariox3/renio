import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { CambioClaveComponent } from './componentes/cambio-clave/cambio-clave.component';
import {SharedModule} from "../../_metronic/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbActiveModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CambioClaveComponent,
    
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModalModule
  ],
  exports: [
    CambioClaveComponent
  ]
})
export class SeguridadModule { }
