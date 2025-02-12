import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Resolucion } from '@interfaces/general/resolucion.interface';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { RespuestaFormaPago } from '@modulos/general/interfaces/forma-pago.interface';
import { FormaPagoService } from '@modulos/general/servicios/forma-pago.service';

@Component({
  selector: 'app-forma-pago-nuevo',
  standalone: true,
  templateUrl: './forma-pago-detalle.component.html',
  styleUrls: ['./forma-pago-detalle.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent,
  ],
})
export default class FormaPagoNuevoComponent extends General implements OnInit {
  public readonly _formaPagoService = inject(FormaPagoService);
  public formaPago: RespuestaFormaPago = {
    id: 0,
    nombre: '',
    cuenta_nombre: '',
    cuenta_codigo: '',
    cuenta_id: 0,
  };

  constructor() {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this._formaPagoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formaPago = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
