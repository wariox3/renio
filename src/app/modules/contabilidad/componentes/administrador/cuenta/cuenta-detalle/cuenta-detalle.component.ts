import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ConCuenta } from '@interfaces/contabilidad/contabilidad-cuenta.interface';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';

@Component({
  selector: 'app-cuenta-detalle',
  standalone: true,
  templateUrl: './cuenta-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    BtnAtrasComponent,
  ],
})
export default class CuentaDetalleComponent extends General implements OnInit {
  cuenta: ConCuenta = {
    nombre: '',
    id: 0,
    codigo: '',
    exige_base: false,
    exige_grupo: false,
    exige_tercero: false,
    permite_movimiento: false,
    cuenta_clase: null,
  };
  @Input() informacionFormulario: any;

  constructor(private cuentaService: CuentaService) {
    super();
  }
  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.cuentaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: ConCuenta) => {
        this.cuenta = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
