import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { HttpService } from '@comun/services/http.service';
import { MultiplesEmailValidator } from '@comun/validaciones/multiplesEmailValidator';
import { ContactoService } from '@modulos/general/servicios/contacto.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

@Component({
  selector: 'app-empleado-formulario',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    BtnAtrasComponent,
    TranslateModule,
    NgbDropdownModule,
],
  templateUrl: './empleado-formulario.component.html',
  styleUrls: ['./empleado-formulario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmpleadoFormularioComponent
  extends General
  implements OnInit
{
  formularioEmpleado: FormGroup;
  arrCiudades: any[];
  arrIdentificacion: any[];
  arrTipoPersona: any[];
  arrRegimen: any[];
  arrAsesores: any[];
  arrPrecios: any[];
  arrPagos: any[];

  selectedDateIndex: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contactoService: ContactoService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioEmpleado = this.formBuilder.group(
      {
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
        nombre_corto: [null, Validators.compose([Validators.maxLength(200)])],
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
          Validators.compose([Validators.required, Validators.maxLength(255)]),
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
        tipo_persona: [2, Validators.compose([Validators.required])],
        regimen: [1, Validators.compose([Validators.required])],
        codigo_ciuu: [null, Validators.compose([Validators.maxLength(200)])],
        barrio: [null, Validators.compose([Validators.maxLength(200)])],
        precio: [null],
        plazo_pago: [null],
        plazo_pago_proveedor: [null],
        asesor: [null],
        cliente: [false],
        proveedor: [false],
        empleado: [true],
      },
      {
        validator: MultiplesEmailValidator.validarCorreos,
      }
    );
  }

  enviarFormulario() {
    if (this.formularioEmpleado.valid) {
      this.actualizarNombreCorto();
      if (this.detalle) {
        this.contactoService
          .actualizarDatosContacto(this.detalle, this.formularioEmpleado.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['/administrador/detalle'], {
              queryParams: {
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                submodelo: this.activatedRoute.snapshot.queryParams['submodelo'],
                detalle:  this.activatedRoute.snapshot.queryParams['detalle'],
              },
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contactoService
          .guardarContacto(this.formularioEmpleado.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['/administrador/detalle'], {
                queryParams: {
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  submodelo: this.activatedRoute.snapshot.queryParams['submodelo'],
                  detalle:  this.activatedRoute.snapshot.queryParams['detalle'],
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioEmpleado.markAllAsTouched();
    }
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioEmpleado.get('nombre1')?.value;
    const nombre2 = this.formularioEmpleado.get('nombre2')?.value;
    const apellido1 = this.formularioEmpleado.get('apellido1')?.value;
    const apellido2 = this.formularioEmpleado.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioEmpleado
      .get('nombre_corto')
      ?.patchValue(nombreCorto, { emitEvent: false });
  }

  get obtenerFormularioCampos() {
    return this.formularioEmpleado.controls;
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioEmpleado.get('numero_identificacion')?.value
    );
    this.formularioEmpleado.patchValue({
      digito_verificacion: digito,
    });
  }

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenCiudad',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
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
    this.formularioEmpleado?.markAsDirty();
    this.formularioEmpleado?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioEmpleado.get('ciudad_nombre')?.setValue(null);
        this.formularioEmpleado.get('ciudad')?.setValue(null);
      } else {
        this.formularioEmpleado
          .get('ciudad_nombre')
          ?.setValue(dato.ciudad_nombre);
        this.formularioEmpleado.get('ciudad')?.setValue(dato.ciudad_id);
      }
    }
    if (campo === 'barrio') {
      if (this.formularioEmpleado.get(campo)?.value === '') {
        this.formularioEmpleado.get(campo)?.setValue(null);
      }
    }
    if (campo === 'codigo_ciuu') {
      if (this.formularioEmpleado.get(campo)?.value === '') {
        this.formularioEmpleado.get(campo)?.setValue(null);
      }
    }
    if (campo === 'nombre2') {
      if (this.formularioEmpleado.get(campo)?.value === '') {
        this.formularioEmpleado.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenIdentificacion',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenRegimen',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenTipoPersona',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenPrecio',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre_corto__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenAsesor',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenPlazoPago',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrRegimen = respuesta[1].registros;
      this.arrTipoPersona = respuesta[2].registros;
      this.arrPrecios = respuesta[3].registros;
      this.arrAsesores = respuesta[4].registros;
      this.arrPagos = respuesta[5].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioEmpleado.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  consultardetalle() {
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioEmpleado.patchValue({
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
          barrio: respuesta.barrio,
          codigo_ciuu: respuesta.codigo_ciuu,
          precio: respuesta.precio_id,
          plazo_pago: respuesta.plazo_pago_id,
          plazo_pago_proveedor: respuesta.plazo_pago_proveedor_id,
          asesor: respuesta.asesor_id,
          cliente: respuesta.cliente,
          proveedor: respuesta.proveedor,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
