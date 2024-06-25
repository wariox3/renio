import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { HttpService } from '@comun/services/http.service';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { MultiplesEmailValidator } from '@comun/validaciones/multiplesEmailValidator';

@Component({
  selector: 'app-contacto-formulario',
  standalone: true,
  templateUrl: './contacto-formulario.component.html',
  styleUrls: ['./contacto-formulario.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(600)]),
    ]),
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
    BtnAtrasComponent,
    CardComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
})
export default class ContactDetalleComponent extends General implements OnInit {
  formularioContacto: FormGroup;
  arrCiudades: any[];
  arrIdentificacion: any[];
  arrTipoPersona: any[];
  arrRegimen: any[];
  arrAsesores: any[];
  arrPrecios: any[];
  arrPagos: any[];
  @Input() ocultarBtnAtras = false;
  @Input() tituliFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgbDropdown, { static: true })
  public ciudadDropdown: NgbDropdown;

  selectedDateIndex: number = -1;

  trackByFn(index: number, item: any) {
    return index; // or unique identifier of your item
  }

  selectNext(event: any) {
    event.preventDefault();
    this.selectedDateIndex =
      (this.selectedDateIndex + 1) % this.arrCiudades.length;
    if (isNaN(this.selectedDateIndex)) {
      this.selectedDateIndex = -1;
    } else {
      if (this.arrCiudades[this.selectedDateIndex]) {
        this.modificarCampoFormulario(
          'ciudad',
          this.arrCiudades[this.selectedDateIndex]
        );
      }
    }
    this.ciudadDropdown.open();
  }

  selectPrevious(event: any) {
    event.preventDefault();
    this.selectedDateIndex =
      (this.selectedDateIndex - 1 + this.arrCiudades.length) %
      this.arrCiudades.length;
    if (isNaN(this.selectedDateIndex)) {
      this.selectedDateIndex = -1;
    } else {
      if (this.arrCiudades[this.selectedDateIndex]) {
        this.modificarCampoFormulario(
          'ciudad',
          this.arrCiudades[this.selectedDateIndex]
        );
      }
    }
    this.ciudadDropdown.open();
  }

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
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioContacto = this.formBuilder.group(
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
        tipo_persona: ['', Validators.compose([Validators.required])],
        regimen: ['', Validators.compose([Validators.required])],
        codigo_ciuu: [null, Validators.compose([Validators.maxLength(200)])],
        barrio: [null, Validators.compose([Validators.maxLength(200)])],
        precio: [null],
        plazo_pago: [1, Validators.compose([Validators.required])],
        plazo_pago_proveedor: [1],
        asesor: [null],
        cliente: [true],
        proveedor: [false],
      },
      {
        validator: MultiplesEmailValidator.validarCorreos,
      }
    );
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
      this.setValidators('nombre_corto', [Validators.maxLength(200)]);
    }
  }

  enviarFormulario() {
    if (this.formularioContacto.valid) {
      if (this.formularioContacto.get('tipo_persona')?.value == 2) {
        this.actualizarNombreCorto();
      }
      if (
        this.activatedRoute.snapshot.queryParams['detalle'] &&
        this.ocultarBtnAtras === false
      ) {
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
              codigo_ciuu: respuesta.codigo_ciuu,
              barrio: respuesta.barrio,
              cliente: respuesta.cliente,
              proveedor: respuesta.proveedor,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['/administrador/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                detalle: respuesta.id,
              },
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contactoService
          .guardarContacto(this.formularioContacto.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              if (this.ocultarBtnAtras) {
                this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
              } else {
                this.router.navigate(['/administrador/detalle'], {
                  queryParams: {
                    modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                    modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                    tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                    formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                    detalle: respuesta.id,
                    accion: 'detalle',
                  },
                });
              }
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
          modelo: 'Identificacion',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
          modelo: 'Regimen',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
          modelo: 'TipoPersona',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
          modelo: 'Precio',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
          modelo: 'Asesor',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
          modelo: 'PlazoPago',
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

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContacto?.markAsDirty();
    this.formularioContacto?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioContacto.get('ciudad_nombre')?.setValue(null);
        this.formularioContacto.get('ciudad')?.setValue(null);
      } else {
        this.formularioContacto
          .get('ciudad_nombre')
          ?.setValue(dato.ciudad_nombre);
        this.formularioContacto.get('ciudad')?.setValue(dato.ciudad_id);
      }
    }
    if (campo === 'barrio') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
    if (campo === 'codigo_ciuu') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
    if (campo === 'nombre2') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
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
          barrio: respuesta.barrio,
          codigo_ciuu: respuesta.codigo_ciuu,
          precio: respuesta.precio_id,
          plazo_pago: respuesta.plazo_pago_id,
          plazo_pago_proveedor: respuesta.plazo_pago_proveedor_id,
          asesor: respuesta.asesor_id,
          cliente: respuesta.cliente,
          proveedor: respuesta.proveedor,
        });

        if (respuesta.tipo_persona_id === 1) {
          //1 es igual a juridico
          this.setValidators('nombre1', [Validators.pattern(/^[a-zA-Z]+$/)]);
          this.setValidators('apellido1', [Validators.pattern(/^[a-zA-Z]+$/)]);
          this.setValidators('nombre_corto', [
            Validators.required,
            Validators.maxLength(200),
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
