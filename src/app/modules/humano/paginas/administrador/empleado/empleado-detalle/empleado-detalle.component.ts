import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { ContactoService } from '@modulos/general/servicios/contacto.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-empleado-detalle',
  standalone: true,
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
    TituloAccionComponent
],
  providers: [provideNgxMask()],
  templateUrl: './empleado-detalle.component.html',
  styleUrls: ['./empleado-detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmpleadoDetalleComponent
  extends General
  implements OnInit
{
  contacto: any = {
    identificacion: 0,
    numero_identificacion: 0,
    identificacion_abreviatura: '',
    nombre_corto: '',
    direccion: '',
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
    correo: '',
    barrio: '',
    tipo_persona: 0,
    ciudad_nombre: 0,
    asesor_nombre_corto: '',
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
