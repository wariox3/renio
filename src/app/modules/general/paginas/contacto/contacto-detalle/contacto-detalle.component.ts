import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { General } from '@comun/clases/general';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactoService } from '@modulos/general/servicios/contacto.service';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { Contacto } from '@interfaces/general/contacto';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-contacto-detalle',
  standalone: true,
  templateUrl: './contacto-detalle.component.html',
  styleUrls: ['./contacto-detalle.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
    CardComponent,
    BtnAtrasComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSwitch,
    NgSwitchCase,
    TituloAccionComponent,
  ],
  providers: [provideNgxMask()],
})
export default class ContactoDetalleComponent
  extends General
  implements OnInit
{
  contacto: Contacto = {
    identificacion: 0,
    numero_identificacion: 0,
    identificacion_abreviatura: '',
    nombre_corto: '',
    direccion: '',
    departamento_nombre: '',
    ciudad: 0,
    telefono: 0,
    celular: 0,
    tipo_persona_id: 0,
    regimen_id: 0,
    regimen_nombre: '',
    digito_verificacion: null,
    nombre1: null,
    nombre2: null,
    apellido1: null,
    apellido2: null,
    codigo_postal: null,
    correo: '',
    codigo_ciuu: '',
    barrio: '',
    tipo_persona: 0,
    ciudad_nombre: 0,
    plazo_pago_id: 0,
    plazo_pago_nombre: '',
    precio_id: 0,
    precio_nombre: '',
    plazo_pago_proveedor_id: 0,
    plazo_pago_proveedor_nombre: '',
    asesor_id: 0,
    asesor_nombre_corto: '',
    cliente: false,
    proveedor: false,
    empleado: false,
    ciudad_id: 0,
    identificacion_id: 0,
    codigo: 0,
    correo_facturacion_electronica: '',
    banco_id: 0,
    banco_nombre: '',
    cuenta_banco_clase_id: 0,
    cuenta_banco_clase_nombre: '',
    numero_cuenta: '',
  };

  constructor(private contactoService: ContactoService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.contacto = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
