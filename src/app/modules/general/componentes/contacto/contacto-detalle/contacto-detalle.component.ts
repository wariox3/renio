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
import { HttpService } from '@comun/services/http.service';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contacto-informacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
  ],
  templateUrl: './contacto-detalle.component.html',
  styleUrls: ['./contacto-detalle.component.scss'],
})
export default class ContactDetalleComponent extends General implements OnInit {
  formularioContacto: FormGroup;
  arrCiudades: any[];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
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
      ciudad_nombre: [''],
      telefono: [''],
      celular: [''],
      tipo_persona: [''],
      regimen: [''],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioContacto.controls;
  }

  enviarFormulario() {}

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'nombre__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Ciudad',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCiudades = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContacto?.markAsDirty();
    this.formularioContacto?.markAsTouched();
    if (campo === 'ciudad') {
      this.formularioContacto.get(campo)?.setValue(dato.ciudad_id);
      this.formularioContacto.get('ciudad_nombre')?.setValue(dato.ciudad_nombre);
    }
    this.changeDetectorRef.detectChanges();
  }
}
