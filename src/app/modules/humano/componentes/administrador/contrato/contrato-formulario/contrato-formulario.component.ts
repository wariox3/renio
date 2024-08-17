import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campoNoObligatorio';
import {
  AutocompletarRegistros,
  RegistroAutocompletarCargo,
  RegistroAutocompletarPension,
  RegistroAutocompletarRiesgo,
  RegistroAutocompletarSalud,
  RegistroAutocompletarSubtipoCotizante,
  RegistroAutocompletarSucursal,
  RegistroAutocompletarTipoCotizante,
} from '@interfaces/comunes/autocompletar';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

@Component({
  selector: 'app-contrato-formulario',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
  ],
  templateUrl: './contrato-formulario.component.html',
  styleUrls: ['./contrato-formulario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit
{
  formularioContrato: FormGroup;
  arrEmpleados: any[] = [];
  arrGrupo: any[] = [];
  arrContratoTipo: any[] = [];
  autocompletarRiesgo: RegistroAutocompletarRiesgo[] = [];
  autocompletarPension: RegistroAutocompletarPension[] = [];
  autocompletarSubtipoCotizante: RegistroAutocompletarSubtipoCotizante[] = [];
  autocompletarSalud: RegistroAutocompletarSalud[] = [];
  autocompletarSucursal: RegistroAutocompletarSucursal[] = [];
  autocompletarTipoCotizante: RegistroAutocompletarTipoCotizante[] = [];
  autocompletarCargo: RegistroAutocompletarCargo[] = [];
  camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contratoService: ContratoService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    } else {
      this.consultarSalario();
    }
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    this.formularioContrato = this.formBuilder.group(
      {
        contacto: ['', Validators.compose([Validators.required])],
        contacto_nombre: [''],
        fecha_desde: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        grupo: ['', Validators.compose([Validators.required])],
        contrato_tipo: ['', Validators.compose([Validators.required])],
        riesgo: ['', Validators.required],
        pension: [1, Validators.required],
        subtipo_cotizante: ['', Validators.required],
        salud: [1, Validators.required],
        sucursal: [''],
        tipo_cotizante: ['', Validators.required],
        cargo: ['', Validators.required],
        cargo_nombre: [''],
        salario: ['', [Validators.required]],
        auxilio_transporte: [false],
        salario_integral: [false],
        comentario: [
          '',
          [Validators.maxLength(300), cambiarVacioPorNulo.validar],
        ],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta'
        ),
      }
    );
  }

  enviarFormulario() {
    if (this.formularioContrato.valid) {
      if (this.detalle) {
        this.contratoService
          .actualizarDatosContacto(this.detalle, this.formularioContrato.value)
          .subscribe((respuesta) => {
            this.formularioContrato.patchValue({
              empleado: respuesta.contacto_id,
              empleadoNombre: respuesta.contado_nombre_corto,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
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
        this.contratoService
          .guardarContrato(this.formularioContrato.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['/administrador/detalle'], {
                queryParams: {
                  modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  detalle: respuesta.id,
                  accion: 'detalle',
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioContrato.markAllAsTouched();
    }
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
              valor1: '',
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumGrupo',
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
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumContratoTipo',
        }
      ),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarRiesgo>
      >('general/funcionalidad/autocompletar/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: '',
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumRiesgo',
      }),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarPension>
      >('general/funcionalidad/autocompletar/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: '',
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumPension',
      }),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarSubtipoCotizante>
      >('general/funcionalidad/autocompletar/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: '',
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumSubtipoCotizante',
      }),
      this.httpService.post<AutocompletarRegistros<RegistroAutocompletarSalud>>(
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
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumSalud',
        }
      ),
      this.httpService.post<AutocompletarRegistros<RegistroAutocompletarSalud>>(
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
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumSucursal',
        }
      ),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarTipoCotizante>
      >('general/funcionalidad/autocompletar/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: '',
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumTipoCotizante',
      }),
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarTipoCotizante>
      >('general/funcionalidad/autocompletar/', {
        filtros: [
          {
            operador: '__icontains',
            propiedad: 'nombre__icontains',
            valor1: '',
            valor2: '',
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumCargo',
      })
    ).subscribe((respuesta: any) => {
      this.arrGrupo = respuesta[0].registros;
      this.arrContratoTipo = respuesta[1].registros;
      this.autocompletarRiesgo = respuesta?.[2]?.registros;
      this.autocompletarPension = respuesta?.[3]?.registros;
      this.autocompletarSubtipoCotizante = respuesta?.[4]?.registros;
      this.autocompletarSalud = respuesta?.[5]?.registros;
      this.autocompletarSucursal = respuesta?.[6]?.registros;
      this.autocompletarTipoCotizante = respuesta?.[7]?.registros;
      this.autocompletarCargo = respuesta?.[8]?.registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  consultarEmpleado(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
        {
          operador: '',
          propiedad: 'empleado',
          valor1: true,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrEmpleados = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.nombre_corto);
    }
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.contacto_id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.contacto_nombre_corto);
    }

    if (campo === 'cargo') {
      this.formularioContrato.get(campo)?.setValue(dato.cargo_id);
      this.formularioContrato.get('cargo_nombre')?.setValue(dato.cargo_nombre);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.contratoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioContrato.patchValue({
          contacto: respuesta.contacto_id,
          contacto_nombre: respuesta.contacto_nombre_corto,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          grupo: respuesta.grupo_id,
          contrato_tipo: respuesta.contrato_tipo_id,
          riesgo: respuesta.riesgo_id,
          pension: respuesta.pension_id,
          subtipo_cotizante: respuesta.subtipo_cotizante_id,
          salud: respuesta.salud_id,
          sucursal: respuesta.sucursal_id,
          tipo_cotizante: respuesta.tipo_cotizante_id,
          cargo: respuesta.cargo_id,
          cargo_nombre: respuesta.cargo_nombre,
          salario: respuesta.salario,
          auxilio_transporte: respuesta.auxilio_transporte,
          salario_integral: respuesta.salario_integral,
          comentario: respuesta.comentario,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  consultarSalario() {
    const bodyData = {
      campos: ['hum_salario_minimo'],
    };
    this.httpService
      .post<{ configuracion: { hum_salario_minimo: number }[] }>(
        'general/configuracion/consulta/',
        bodyData
      )
      .subscribe((respuesta) => {
        const salario = respuesta.configuracion[0].hum_salario_minimo;
        this.formularioContrato.patchValue({
          salario,
        });
      });
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;

      // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
      if (desde && hasta && new Date(desde) > new Date(hasta)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }

  cambioDeContratoTipo(event: Event) {
    const selector = event.target as HTMLInputElement;

    if (selector.value === '1') {
      this.formularioContrato.patchValue({
        fecha_hasta: this.formularioContrato.get('fecha_desde')?.value,
      });
    }
  }

  consultarCargo(event: any) {
    const arrFiltros = {
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
      modelo: 'HumCargo',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.autocompletarCargo = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
    this.changeDetectorRef.detectChanges();
  }

  limpiarCargo(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContrato.controls['cargo'].setValue(null);
    }
  }
}
