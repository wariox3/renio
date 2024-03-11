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

@Component({
  selector: 'app-contacto-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    SoloNumerosDirective,
  ],
  templateUrl: './contacto-detalle.component.html',
  styleUrls: ['./contacto-detalle.component.scss'],
})
export default class ContactoDetalleComponent extends General implements OnInit {

  contacto: Contacto = {
    identificacion: 0,
    numero_identificacion: 0,
    nombre_corto: '',
    direccion: '',
    ciudad: 0,
    telefono: 0,
    celular: 0,
    tipo_persona_id: 0,
    tipo_persona_nombre: 0,
    regimen: 0,
    digito_verificacion: null,
    nombre1: null,
    nombre2: null,
    apellido1: null,
    apellido2: null,
    codigo_postal: null,
    correo: '',
    codigo_ciuu: '',
    barrio: ''
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
