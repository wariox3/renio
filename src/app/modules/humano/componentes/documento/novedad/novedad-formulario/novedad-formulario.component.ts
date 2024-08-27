import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import {
  AutocompletarRegistros,
  RegistroAutocompletarNovedadTipo,
} from '@interfaces/comunes/autocompletar';
import { NovedadService } from '@modulos/humano/servicios/novedad';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-novedad-formulario',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
  ],
  templateUrl: './novedad-formulario.component.html',
  styleUrl: './novedad-formulario.component.scss',
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
})
export default class CreditoFormularioComponent
  extends General
  implements OnInit
{
  formularioAdicional: FormGroup;
  arrContratos: any[] = [];
  arrNovedadTipos: RegistroAutocompletarNovedadTipo[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private novedadService: NovedadService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    this.formularioAdicional = this.formBuilder.group(
      {
        fecha_desde: [
          fechaActual.toISOString().substring(0, 10),
          Validators.compose([Validators.required]),
        ],
        fecha_hasta: [
          fechaActual.toISOString().substring(0, 10),
          Validators.compose([Validators.required]),
        ],
        contrato: ['', Validators.compose([Validators.required])],
        contrato_nombre: [''],
        novedad_tipo: ['', Validators.compose([Validators.required])],
        dias_dinero: [0],
        dias_disfrutados: [0],
        dias_disfrutados_reales: [0],
        fecha_desde_periodo: [null],
        fecha_hasta_periodo: [null],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta'
        ),
      }
    );
  }

  consultarInformacion() {
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarNovedadTipo>>(
        'general/funcionalidad/autocompletar/',
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
          modelo: 'HumNovedadTipo',
        }
      )
      .subscribe((respuesta: any) => {
        this.arrNovedadTipos = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  enviarFormulario() {
    if (this.formularioAdicional.valid) {
      if (this.detalle) {
        this.novedadService
          .actualizarDatoNovedad(this.detalle, this.formularioAdicional.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametros) => {
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  ...parametros,
                  detalle: respuesta.id,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.novedadService
          .guardarNovedad(this.formularioAdicional.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametros) => {
                this.router.navigate(['documento/detalle'], {
                  queryParams: {
                    ...parametros,
                    detalle: respuesta.id,
                  },
                });
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioAdicional.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.novedadService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioAdicional.patchValue({
          fecha_inicio: respuesta.fecha_inicio,
          contrato: respuesta.contrato_id,
          contrato_nombre: respuesta.contrato_contacto_nombre_corto,
          novedad_tipo: respuesta.novedad_tipo_id,
          dias_dinero: respuesta.dias_dinero,
          dias_disfrutados: respuesta.dias_disfrutados,
          dias_disfrutados_reales: respuesta.dias_disfrutados_reales,
          fecha_desde_periodo: respuesta.fecha_desde_periodo,
          fecha_hasta_periodo: respuesta.fecha_hasta_periodo,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarContratos(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicional?.markAsDirty();
    this.formularioAdicional?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioAdicional.get(campo)?.setValue(dato.contrato_id);
      this.formularioAdicional
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
    }
    this.changeDetectorRef.detectChanges();
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

  novedadTipoSeleccionado($event: Event) {
    let valorPersonaTipo = $event.target as HTMLInputElement;

    if (parseInt(valorPersonaTipo.value) === 7) {
      // 7 es igual a vacaciones
      this.setValidators('dias_dinero', [Validators.required]);
      this.setValidators('dias_disfrutados', [Validators.required]);
      this.setValidators('dias_disfrutados_reales', [Validators.required]);
      this.setValidators('fecha_desde_periodo', [Validators.required]);
      this.setValidators('fecha_hasta_periodo', [Validators.required]);
    } else {
      this.formularioAdicional.get('dias_dinero')?.clearValidators();
      this.formularioAdicional.get('dias_dinero')?.updateValueAndValidity();
      this.formularioAdicional.get('dias_disfrutados')?.clearValidators();
      this.formularioAdicional
        .get('dias_disfrutados')
        ?.updateValueAndValidity();
      this.formularioAdicional
        .get('dias_disfrutados_reales')
        ?.clearValidators();
      this.formularioAdicional
        .get('dias_disfrutados_reales')
        ?.updateValueAndValidity();
      this.formularioAdicional.get('fecha_desde_periodo')?.clearValidators();
      this.formularioAdicional
        .get('fecha_desde_periodo')
        ?.updateValueAndValidity();
      this.formularioAdicional.get('fecha_hasta_periodo')?.clearValidators();
      this.formularioAdicional
        .get('fecha_hasta_periodo')
        ?.updateValueAndValidity();

      this.formularioAdicional.patchValue({
        dias_dinero: 0,
        dias_disfrutados: 0,
        dias_disfrutados_reales: 0,
        fecha_desde_periodo: null,
        fecha_hasta_periodo: null,
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioAdicional.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }
}
