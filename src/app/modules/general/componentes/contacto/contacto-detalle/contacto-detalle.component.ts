import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-contacto-informacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
  ],
  templateUrl: './contacto-detalle.component.html',
  styleUrls: ['./contacto-detalle.component.scss'],
})
export default class ContactDetalleComponent
  extends General
  implements OnInit
{
  formularioContacto: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.formularioContacto = this.formBuilder.group({
      identificacion: ['', Validators.compose([Validators.required])],
      numero_identificacion: [''],
      nombre_corto: [''],
      direccion: [''],
      ciudad: [''],
      telefono: [''],
      celular: [''],
      tipo_persona: [''],
      regimen: [''],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioContacto.controls;
  }

  enviarFormulario() {
    
  }
}
