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
    SoloNumerosDirective,
  ],
  templateUrl: './contacto-detalle.component.html',
  styleUrls: ['./contacto-detalle.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(800)]),
    ]),
  ],
})
export default class ContactDetalleComponent extends General implements OnInit {
  formularioContacto: FormGroup;
  arrCiudades: any[];
  arrIdentificacion: any[];
  arrTipoPersona: any[];
  arrRegimen: any[];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contactoService: ContactoService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.consultarInformacion();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioContacto = this.formBuilder.group({
      numero_identificacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      digito_verificacion: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(1)]),
      ],
      identificacion: ['', Validators.compose([Validators.required])],
      nombre_corto: [
        null,
        Validators.compose([
          Validators.maxLength(200),
          Validators.pattern(/^[a-zA-Z0-9&.\-_\s]*$/),
        ]),
      ],
      nombre1: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
      ],
      nombre2: [
        null,
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
      ],
      apellido1: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
      ],
      apellido2: [
        null,
        Validators.compose([
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
      ],
      direccion: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      correo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]),
      ],
      ciudad_nombre: [''],
      ciudad: ['', Validators.compose([Validators.required])],
      telefono: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      celular: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      tipo_persona: ['', Validators.compose([Validators.required])],
      regimen: ['', Validators.compose([Validators.required])],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioContacto.controls;
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioContacto.get('nombre1')?.value;
    const nombre2 = this.formularioContacto.get('nombre2')?.value;
    const apellido1 = this.formularioContacto.get('apellido1')?.value;
    const apellido2 = this.formularioContacto.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioContacto
      .get('nombre_corto')
      ?.patchValue(nombreCorto, { emitEvent: false });
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioContacto.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  tipoPersonaSeleccionado($event: any) {
    if ($event.target.value === '1') {
      //1 es igual a juridico
      this.setValidators('nombre1', [Validators.pattern(/^[a-zA-Z]+$/)]);
      this.setValidators('apellido1', [Validators.pattern(/^[a-zA-Z]+$/)]);
      this.setValidators('nombre_corto', [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(/^[a-zA-Z0-9&.\-_\s]*$/),
      ]);
      this.formularioContacto.patchValue({
        nombre1: null,
        nombre2: null,
        apellido1: null,
        apellido2: null,
      });
    } else {
      //2 es natural
      this.setValidators('nombre1', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]);
      this.setValidators('apellido1', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]);
      this.setValidators('nombre_corto', [
        Validators.maxLength(200),
        Validators.pattern(/^[a-zA-Z0-9&.\-_\s]*$/),
      ]);
    }
  }

  enviarFormulario() {
    if (this.formularioContacto.valid) {
      if (this.formularioContacto.get('tipo_persona')?.value == 2) {
        this.actualizarNombreCorto();
      }

      if (this.detalle) {
        this.contactoService
          .actualizarDatosContacto(this.detalle, this.formularioContacto.value)
          .subscribe((respuesta) => {
            this.formularioContacto.patchValue({
              numero_identificacion: respuesta.numero_identificacion,
              identificacion: respuesta.identificacion_id,
              codigo: respuesta.codigo,
              nombre_corto: respuesta.nombre_corto,
              nombre1: respuesta.nombre1,
              nombre2: respuesta.nombre2,
              apellido1: respuesta.apellido1,
              apellido2: respuesta.apellido2,
              ciudad: respuesta.ciudad_id,
              ciudad_nombre: respuesta.ciudad_nombre,
              direccion: respuesta.direccion,
              telefono: respuesta.telefono,
              celular: respuesta.celular,
              correo: respuesta.correo,
              tipo_persona: respuesta.tipo_persona_id,
              regimen: respuesta.regimen_id,
            });
            this.alertaService.mensajaExitoso('Se actualizo la información');
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contactoService
          .guardarContacto(this.formularioContacto.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Guardado con exito');
              this.router.navigate(['/detalle'], {
                queryParams: {
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                  detalle: respuesta.id,
                  accion: 'detalle',
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }

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

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__contains',
              propiedad: 'nombre__contains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'Identificacion',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__contains',
              propiedad: 'nombre__contains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'Regimen',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__contains',
              propiedad: 'nombre__contains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'TipoPersona',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrRegimen = respuesta[1].registros;
      this.arrTipoPersona = respuesta[2].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContacto?.markAsDirty();
    this.formularioContacto?.markAsTouched();
    if (campo === 'ciudad') {
      this.formularioContacto.get(campo)?.setValue(dato.ciudad_id);
      this.formularioContacto
        .get('ciudad_nombre')
        ?.setValue(dato.ciudad_nombre);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioContacto.patchValue({
          numero_identificacion: respuesta.numero_identificacion,
          digito_verificacion: respuesta.digito_verificacion,
          identificacion: respuesta.identificacion_id,
          codigo: respuesta.codigo,
          nombre_corto: respuesta.nombre_corto,
          nombre1: respuesta.nombre1,
          nombre2: respuesta.nombre2,
          apellido1: respuesta.apellido1,
          apellido2: respuesta.apellido2,
          ciudad: respuesta.ciudad_id,
          ciudad_nombre: respuesta.ciudad_nombre,
          direccion: respuesta.direccion,
          telefono: respuesta.telefono,
          celular: respuesta.celular,
          correo: respuesta.correo,
          tipo_persona: respuesta.tipo_persona_id,
          regimen: respuesta.regimen_id,
        });

        if (respuesta.tipo_persona_id === 1) {
          //1 es igual a juridico
          this.setValidators('nombre1', [Validators.pattern(/^[a-zA-Z]+$/)]);
          this.setValidators('apellido1', [Validators.pattern(/^[a-zA-Z]+$/)]);
          this.setValidators('nombre_corto', [
            Validators.required,
            Validators.maxLength(200),
            Validators.pattern(/^[a-zA-Z0-9&.\-_\s]*$/),
          ]);
          this.formularioContacto.patchValue({
            nombre1: null,
            nombre2: null,
            apellido1: null,
            apellido2: null,
          });
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContacto.get('numero_identificacion')?.value
    );
    this.formularioContacto.patchValue({
      digito_verificacion: digito,
    });
  }
}
