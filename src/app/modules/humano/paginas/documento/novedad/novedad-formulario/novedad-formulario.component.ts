import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarContratoComponent } from '@comun/componentes/buscar-contrato/buscar-contrato.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { GeneralService } from '@comun/services/general.service';
import { validarRangoDeFechas } from '@comun/validaciones/rango-fechas.validator';
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import { RegistroAutocompletarHumNovedadTipo } from '@interfaces/comunes/autocompletar/humano/hum-novedad-tipo.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NovedadService } from '@modulos/humano/servicios/novedad.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-novedad-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarContratoComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
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
  arrNovedadTipos: RegistroAutocompletarHumNovedadTipo[] = [];
  private _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
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
        contrato_identificacion: [''],
        novedad_tipo: ['', Validators.compose([Validators.required])],
        dias_dinero: [0],
        dias_disfrutados: [0],
        dias_disfrutados_reales: [0],
        fecha_desde_periodo: [null],
        fecha_hasta_periodo: [null],
      },
      {
        validator: [
          validarRangoDeFechas('fecha_desde', 'fecha_hasta'),
          validarRangoDeFechas('fecha_desde_periodo', 'fecha_hasta_periodo'),
        ],
      }
    );
  }

  consultarInformacion() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumNovedadTipo>({
        modelo: 'HumNovedadTipo',
        serializador: 'ListaAutocompletar',
      })
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
          contrato_identificacion:
            respuesta.contrato_contacto_numero_identificacion,
          novedad_tipo: respuesta.novedad_tipo_id,
          dias_dinero: respuesta.dias_dinero,
          dias_disfrutados: respuesta.dias_disfrutados,
          dias_disfrutados_reales: respuesta.dias_disfrutados_reales,
          fecha_desde_periodo: respuesta.fecha_desde_periodo,
          fecha_hasta_periodo: respuesta.fecha_hasta_periodo,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarContratos(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(arrFiltros)
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
      this.formularioAdicional
        .get('contrato_identificacion')
        ?.setValue(dato.contrato_contacto_numero_identificacion);
    }
    this.changeDetectorRef.detectChanges();
  }

  novedadTipoSeleccionado($event: Event) {
    let valorPersonaTipo = $event.target as HTMLInputElement;

    if (parseInt(valorPersonaTipo.value) === 7) {
      // 7 es igual a vacaciones
      this.setValidators('dias_dinero', [
        Validators.required,
        Validators.min(0),
      ]);
      this.setValidators('dias_disfrutados', [
        Validators.required,
        Validators.min(0),
      ]);
      this.setValidators('dias_disfrutados_reales', [
        Validators.required,
        Validators.min(1),
      ]);
      this.setValidators('fecha_desde_periodo', [Validators.required]);
      this.setValidators('fecha_hasta_periodo', [Validators.required]);

      this.formularioAdicional.patchValue({
        dias_dinero: 1,
        dias_disfrutados: 1,
        dias_disfrutados_reales: 1,
      });
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
