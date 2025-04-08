import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { GeneralService } from '@comun/services/general.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { minimumDaysBetweenDates } from '@comun/validaciones/dia-minimo-entre-fechas.validator';
import { ProgramacionService } from '@modulos/humano/servicios/programacion.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { RegistroAutocompletarHumPagoTipo } from '@interfaces/comunes/autocompletar/humano/hum-pago-tipo.interface';
import { RegistroAutocompletarHumGrupo } from '@interfaces/comunes/autocompletar/humano/hum-grupo.interface';

@Component({
  selector: 'app-programacion-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  templateUrl: './programacion-formulario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  grupoSeleccionado: any;
  arrPagoTipo: RegistroAutocompletarHumPagoTipo[];
  arrGrupo: RegistroAutocompletarHumGrupo[] = [];
  formularioProgramacion: FormGroup;

  private _generalService = inject(GeneralService);
  private _destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private programacionService: ProgramacionService,
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
  }

  inicializarCamposReactivos() {
    this._campoReactivoTipo();

    this.formularioProgramacion
      .get('grupo')
      ?.valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        if (value) {
          this.grupoSeleccionado = this.arrGrupo.find((grupo) => {
            let valor = Number(value);
            return grupo.grupo_id === valor;
          });
          if (this.grupoSeleccionado !== undefined) {
            this.actualizarValidacion(
              this.grupoSeleccionado.grupo_periodo_dias,
            );
            this.formularioProgramacion.patchValue({
              periodo: this.grupoSeleccionado.grupo_periodo_id,
            });
          }
        } else {
          this.actualizarValidacion(0);
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  private _campoReactivoTipo() {
    this.formularioProgramacion
      .get('pago_tipo')
      ?.valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        const numericValue = Number(value); // Convertimos a número
        if (numericValue == 2 || numericValue == 3) {
          // limpiar validaciones
          this._limpiarValidacionFechaHasta();
        } else {
          // llamar actualizar validacion
          if (this.grupoSeleccionado) {
            this.actualizarValidacion(
              this.grupoSeleccionado.grupo_periodo_dias,
            );
          }
        }
      });
  }

  private _limpiarValidacionFechaHasta() {
    this.formularioProgramacion.get('fecha_hasta')?.clearValidators();
    this.formularioProgramacion.get('fecha_hasta')?.clearAsyncValidators();
    this.formularioProgramacion.setValidators([
      this.fechaDesdeMenorQueFechaHasta('fecha_desde', 'fecha_hasta'),
    ]);
    this.formularioProgramacion.get('fecha_hasta')?.updateValueAndValidity();
  }

  actualizarValidacion(dias: number) {
    const pagoId = this.formularioProgramacion.get('pago_tipo')?.value;
    if (pagoId == 2 || pagoId == 3) {
      this.formularioProgramacion.setValidators([
        this.fechaDesdeMenorQueFechaHasta('fecha_desde', 'fecha_hasta'),
      ]);
    } else {
      this.formularioProgramacion.setValidators([
        this.fechaDesdeMenorQueFechaHasta('fecha_desde', 'fecha_hasta'),
        minimumDaysBetweenDates(dias),
      ]);
    }

    this.formularioProgramacion.get('fecha_hasta')?.updateValueAndValidity();
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const primerDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1,
    );
    const ultimoDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      0,
    );

    const fechaDesde = `${primerDiaMes.getFullYear()}-${(
      primerDiaMes.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${primerDiaMes.getDate().toString().padStart(2, '0')}`;

    this.formularioProgramacion = this.formBuilder.group(
      {
        fecha_desde: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta_periodo: [
          fechaDesde,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        pago_tipo: [1, Validators.compose([Validators.required])],
        grupo: ['', Validators.compose([Validators.required])],
        periodo: [null, Validators.compose([Validators.required])],
        nombre: [
          null,
          Validators.compose([
            cambiarVacioPorNulo.validar,
            Validators.maxLength(100),
          ]),
        ],
        descuento_salud: [true],
        descuento_pension: [true],
        descuento_fondo_solidaridad: [true],
        descuento_retencion_fuente: [true],
        pago_incapacidad: [true],
        pago_licencia: [true],
        pago_vacacion: [true],
        pago_horas: [true],
        pago_auxilio_transporte: [true],
        descuento_credito: [true],
        descuento_embargo: [true],
        adicional: [true],
        pago_prima: [true],
        pago_cesantia: [true],
        pago_interes: [true],
        comentario: [
          null,
          Validators.compose([
            Validators.maxLength(500),
            cambiarVacioPorNulo.validar,
          ]),
        ],
      },
      {
        validator: [
          this.fechaDesdeMenorQueFechaHasta('fecha_desde', 'fecha_hasta'),
        ],
      },
    );
  }

  consultarInformacion() {
    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarHumPagoTipo>(
        {
          modelo: 'HumPagoTipo',
          serializador: 'ListaAutocompletar',
        },
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarHumGrupo>(
        {
          limite_conteo: 10000,
          modelo: 'HumGrupo',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).subscribe((respuesta) => {
      this.arrPagoTipo = respuesta[0].registros;
      this.arrGrupo = respuesta[1].registros;

      if (this.detalle) {
        this.consultarDetalle();
      }

      this.inicializarCamposReactivos();
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario() {
    if (this.formularioProgramacion.valid) {
      if (this.detalle) {
        this.programacionService
          .actualizarDatosProgramacion(
            this.detalle,
            this.formularioProgramacion.value,
          )
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametros) => {
              this.router.navigate([`humano/proceso/detalle/${respuesta.id}`], {
                queryParams: {
                  ...parametros,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.programacionService
          .guardarProgramacion(this.formularioProgramacion.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametros) => {
                this.router.navigate(
                  [`humano/proceso/detalle/${respuesta.id}`],
                  {
                    queryParams: {
                      ...parametros,
                    },
                  },
                );
              });
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioProgramacion.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.programacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioProgramacion.patchValue({
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          fecha_hasta_periodo: respuesta.fecha_hasta_periodo,
          nombre: respuesta.nombre,
          pago_tipo: respuesta.pago_tipo_id,
          grupo: respuesta.grupo_id,
          descuento_salud: respuesta.descuento_salud,
          descuento_pension: respuesta.descuento_pension,
          descuento_fondo_solidaridad: respuesta.descuento_fondo_solidaridad,
          descuento_retencion_fuente: respuesta.descuento_retencion_fuente,
          pago_incapacidad: respuesta.pago_incapacidad,
          pago_licencia: respuesta.pago_licencia,
          pago_vacacion: respuesta.pago_vacacion,
          pago_horas: respuesta.pago_horas,
          pago_auxilio_transporte: respuesta.pago_auxilio_transporte,
          descuento_credito: respuesta.descuento_credito,
          descuento_embargo: respuesta.descuento_embargo,
          adicional: respuesta.adicional,
          comentario: respuesta.comentario,
          dias: respuesta.dias,
          cantidad: respuesta.contratos,
          periodo: respuesta.periodo_id,
          pago_prima: respuesta.pago_prima,
          pago_cesantia: respuesta.pago_cesantia,
          pago_interes: respuesta.pago_interes,
        });

        this.grupoSeleccionado = this.arrGrupo.find((grupo) => {
          let valor = Number(respuesta.grupo_id);
          return grupo.grupo_id === valor;
        });

        if (this.grupoSeleccionado !== undefined) {
          this.actualizarValidacion(this.grupoSeleccionado.grupo_periodo_dias);
          this.formularioProgramacion.patchValue({
            periodo: this.grupoSeleccionado.grupo_periodo_id,
          });
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioProgramacion?.markAsDirty();
    this.formularioProgramacion?.markAsTouched();
    if (campo === 'fecha_hasta_periodo') {
      this.formularioProgramacion.get(campo)?.setValue(dato);
    }
    this.changeDetectorRef.detectChanges();
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;
      if (desde !== '' && hasta !== '') {
        // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
        if (desde && hasta && new Date(desde) > new Date(hasta)) {
          return { fechaInvalida: true };
        }
      }
      return null;
    };
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
