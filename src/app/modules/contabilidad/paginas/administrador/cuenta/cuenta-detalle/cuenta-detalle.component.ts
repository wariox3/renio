import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ConCuenta } from '@modulos/contabilidad/interfaces/contabilidad-cuenta.interface';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ModalTransladarMovimientosComponent } from "./componentes/modal-transladar-movimientos/modal-transladar-movimientos.component";

@Component({
  selector: 'app-cuenta-detalle',
  standalone: true,
  templateUrl: './cuenta-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent,
    NgbDropdownModule,
    ModalTransladarMovimientosComponent
],
})
export default class CuentaDetalleComponent extends General implements OnInit {
  cuenta: ConCuenta = {
    nombre: '',
    id: 0,
    codigo: '',
    exige_base: false,
    exige_grupo: false,
    exige_contacto: false,
    permite_movimiento: false,
    cuenta_clase: null,
    cuenta_clase_id: 0,
    cuenta_grupo_id: 0,
    cuenta_cuenta_id: 0,
    cuenta_clase_nombre: '',
    cuenta_grupo_nombre: '',
    cuenta_cuenta_nombre: '',
  };
  @Input() informacionFormulario: any;
  @ViewChild(ModalTransladarMovimientosComponent)
  modalTransladarMovimientosComponent: ModalTransladarMovimientosComponent;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
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

  abrirModalTranladarMovimientos(){
    this.dropdown.close()
    this.modalTransladarMovimientosComponent.abrirModal()
  }
}
