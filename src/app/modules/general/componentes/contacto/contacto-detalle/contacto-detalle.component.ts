import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { HttpService } from '@comun/services/http.service';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactoService } from '@modulos/general/servicios/contacto.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Contacto } from '@interfaces/general/contacto';
import { CardComponent } from "../../../../../comun/componentes/card/card.component";

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
        TranslationModule,
        NgbDropdownModule,
        SoloNumerosDirective,
        CardComponent
    ]
})
export default class ContactoDetalleComponent extends General implements OnInit {

  contacto: Contacto = {
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
    asesor_id: 0,
    asesor_nombre_corto: ''
  }

  constructor(
    private contactoService: ContactoService,
  ) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        console.log(respuesta);
        this.contacto = respuesta
        this.changeDetectorRef.detectChanges()
      });
  }

}
