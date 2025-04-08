import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FechasService } from '@comun/services/fechas.service';
import { ActivoService } from '@modulos/contabilidad/servicios/activo.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { SeleccionarActivoGrupoComponent } from '../../../../../../comun/componentes/selectores/seleccionar-activo-grupo/seleccionar-activo-grupo.component';
import { SeleccionarMetodoDepreciacionComponent } from '../../../../../../comun/componentes/selectores/seleccionar-metodo-depreciacion/seleccionar-metodo-depreciacion.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-grupo-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    CuentasComponent,
    SeleccionarGrupoComponent,
    SeleccionarMetodoDepreciacionComponent,
    SeleccionarActivoGrupoComponent,
  ],
  templateUrl: './activo-formulario.component.html',
  styleUrl: './activo-formulario.component.scss',
})
export default class ActivoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _fechasService = inject(FechasService);
  private _activoService = inject(ActivoService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  public formularioConActivo: FormGroup;
  public cuentaGastoCodigo: string;
  public cuentaGastoNombre: string;
  public cuentaDepreciacionCodigo: string;
  public cuentaDepreciacionNombre: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.iniciarFormulario();

    if (this.detalle) {
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
    const fechaActual = this._fechasService.obtenerFechaActualFormateada();

    this.formularioConActivo = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      marca: [null, Validators.maxLength(100)],
      serie: [null, Validators.maxLength(100)],
      modelo: [null],
      fecha_compra: [fechaActual],
      fecha_activacion: [fechaActual],
      fecha_baja: [null],
      duracion: [0],
      valor_compra: [0],
      depreciacion_inicial: [0],
      activo_grupo: [null, Validators.required],
      metodo_depreciacion: [null, Validators.required],
      cuenta_gasto: [null, Validators.required],
      cuenta_depreciacion: [null, Validators.required],
      grupo: [null, Validators.required],
    });
  }

  formSubmit() {
    if (this.formularioConActivo.valid) {
      if (this.detalle) {
        this._activoService
          .actualizarDatos(this.detalle, this.formularioConActivo.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                queryParams: {
                  ...parametro,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this._activoService
          .guardar(this.formularioConActivo.value)
          .pipe(
            tap((respuesta) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioConActivo.markAllAsTouched();
    }
  }

  consultardetalle() {
    this._activoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioConActivo.patchValue({
          nombre: respuesta.nombre,
          codigo: respuesta.codigo,
          marca: respuesta.marca,
          serie: respuesta.serie,
          modelo: respuesta.modelo,
          fecha_compra: respuesta.fecha_compra,
          fecha_activacion: respuesta.fecha_activacion,
          fecha_baja: respuesta.fecha_baja,
          duracion: respuesta.duracion,
          valor_compra: respuesta.valor_compra,
          depreciacion_inicial: respuesta.depreciacion_inicial,
          activo_grupo: respuesta.activo_grupo_id,
          metodo_depreciacion: respuesta.metodo_depreciacion,
          cuenta_gasto: respuesta.cuenta_gasto,
          cuenta_depreciacion: respuesta.cuenta_depreciacion,
          grupo: respuesta.grupo,
        });
        this.cuentaGastoNombre = respuesta.cuenta_gasto_nombre;
        this.cuentaGastoCodigo = respuesta.cuenta_gasto_codigo;
        this.cuentaDepreciacionNombre = respuesta.cuenta_depreciacion_nombre;
        this.cuentaDepreciacionCodigo = respuesta.cuenta_depreciacion_codigo;
        this.changeDetectorRef.detectChanges();
      });
  }

  onSeleccionarMetodoDepreciacionChange(id: number) {
    this.formularioConActivo.patchValue({
      metodo_depreciacion: id,
    });
  }

  onSeleccionarActivoGrupoChange(id: number) {
    this.formularioConActivo.patchValue({
      activo_grupo: id,
    });
  }

  agregarCuentaGastoSeleccionado(cuenta: any) {
    this.cuentaGastoNombre = cuenta.cuenta_nombre;
    this.cuentaGastoCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
    this.formularioConActivo.patchValue({
      cuenta_gasto: cuenta.cuenta_id,
    });
  }

  limpiarCuentaGastoSeleccionado() { }

  agregarCuentaDepreciacionSeleccionado(cuenta: any) {
    this.cuentaDepreciacionNombre = cuenta.cuenta_nombre;
    this.cuentaDepreciacionCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
    this.formularioConActivo.patchValue({
      cuenta_depreciacion: cuenta.cuenta_id,
    });
  }

  limpiarCuentaDepreciacionSeleccionado() { }

  onSeleccionarGrupoChange(id: number) {
    this.formularioConActivo.patchValue({
      grupo: id,
    });
  }
}
