import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { Resolucion } from '@interfaces/general/resolucion.interface';
import { CardComponent } from "@comun/componentes/card/card.component";
import { BtnAtrasComponent } from "@comun/componentes/btn-atras/btn-atras.component";
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
    selector: 'app-resolucion-nuevo',
    standalone: true,
    templateUrl: './resolucion-detalle.component.html',
    styleUrls: ['./resolucion-detalle.component.scss'],
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent
]
})
export default class ResolucionNuevoComponent
  extends General
  implements OnInit
{
  resolucion: Resolucion = {
    prefijo: '',
    numero: '',
    consecutivo_desde: 0,
    consecutivo_hasta: 0,
    fecha_desde: undefined,
    fecha_hasta: undefined,
    venta: false,
    compra: false
  };

  constructor(private resolucionService: ResolucionService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.resolucionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.resolucion = respuesta
        this.changeDetectorRef.detectChanges();
      });
  }
}
