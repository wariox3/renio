import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { validarConsecutivos } from '@comun/validaciones/validar-resolucion-consecutivos.validator';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { validarRangoDeFechas } from '@comun/validaciones/rango-fechas.validator';
import { Subject, takeUntil } from 'rxjs';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';

@Component({
  selector: 'app-resolucion-nuevo',
  standalone: true,
  templateUrl: './resolucion-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbModalModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SoloNumerosDirective,
  ],
  providers: [NgbActiveModal],
})
export default class ResolucionFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioResolucion: FormGroup;
  @Input() ocultarBtnAtras: Boolean = false;
  @Input() tipoRolucion: 'compra' | 'venta' | null = null;
  @Input() tituloFijo: Boolean = false;
  @Input() editarInformacion: Boolean = false;
  @Input() idEditarInformacion: number | null = null;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private resolucionService: ResolucionService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.iniciarFormulario();
    if (this.detalle || this.editarInformacion) {
      this.consultardetalle();
    }
  }

  private configurarModuloListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioResolucion = this.formBuilder.group(
      {
        prefijo: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(10)]),
        ],
        numero: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
          ]),
        ],
        consecutivo_desde: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(200), Validators.max(2147483647)]),
        ],
        consecutivo_hasta: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(200), Validators.max(2147483647)]),
        ],
        fecha_desde: [
          fechaVencimientoInicial,
          Validators.compose([Validators.required]),
        ],
        fecha_hasta: [
          fechaVencimientoInicial,
          Validators.compose([Validators.required]),
        ],
      },
      {
        validators: [
          validarConsecutivos(),
          validarRangoDeFechas('fecha_desde', 'fecha_hasta'),
        ],
      }
    );
  }

  get obtenerFormularioCampos() {
    return this.formularioResolucion.controls;
  }

  enviarFormulario() {
    if (this.formularioResolucion.valid) {
      let tipoResolucion: any = {};
      if (this.parametrosUrl?.resoluciontipo) {
        tipoResolucion[this.parametrosUrl.resoluciontipo] = true;
      }
      if (this.tipoRolucion != null) {
        tipoResolucion[this.tipoRolucion] = true;
      }

      if (this.detalle || this.idEditarInformacion) {
        let resolucionId = this.detalle;

        if (this.idEditarInformacion !== null) {
          resolucionId = this.idEditarInformacion;
        }

        this.resolucionService
          .actualizarDatos(resolucionId, {
            ...this.formularioResolucion.value,
            ...tipoResolucion,
          })
          .subscribe((respuesta: any) => {
            this.formularioResolucion.patchValue({
              prefijo: respuesta.prefijo,
              numero: respuesta.numero,
              consecutivo_desde: respuesta.consecutivo_desde,
              consecutivo_hasta: respuesta.consecutivo_hasta,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,

                  },
                });
              });
            }
          });
      } else {
        this.resolucionService
          .guardarResolucion({
            ...this.formularioResolucion.value,
            ...tipoResolucion,
          })
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            }
          });
      }
    } else {
      this.formularioResolucion.markAllAsTouched();
    }
  }

  consultardetalle() {
    let resolucionId = this.detalle;

    if (this.idEditarInformacion !== null) {
      resolucionId = this.idEditarInformacion;
    }

    this.resolucionService
      .consultarDetalle(resolucionId)
      .subscribe((respuesta: any) => {
        this.formularioResolucion.patchValue({
          prefijo: respuesta.prefijo,
          numero: respuesta.numero,
          consecutivo_desde: respuesta.consecutivo_desde,
          consecutivo_hasta: respuesta.consecutivo_hasta,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
