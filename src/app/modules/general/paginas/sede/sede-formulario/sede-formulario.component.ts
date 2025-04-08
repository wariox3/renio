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
import { SedeService } from '@modulos/general/servicios/sede.service';
import { TranslateModule } from '@ngx-translate/core';
import { provideNgxMask } from 'ngx-mask';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { SeleccionarGrupoComponent } from '../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { GeneralService } from '@comun/services/general.service';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Subject, takeUntil } from 'rxjs';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-sede-formulario',
  standalone: true,
  templateUrl: './sede-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SeleccionarGrupoComponent,
  ],
  providers: [provideNgxMask()],
})
export default class AsesorFormularioComponent
  extends General
  implements OnInit, OnDestroy
{

  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService)
  formularioSede: FormGroup;
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private sedeService: SedeService,
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
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
    this.formularioSede = this.formBuilder.group({
      nombre: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      grupo: [null],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioSede.controls;
  }

  enviarFormulario() {
    if (this.formularioSede.valid) {
      if (this.detalle) {
        this.sedeService
          .actualizarDatos(this.detalle, this.formularioSede.value)
          .subscribe((respuesta) => {
            this.formularioSede.patchValue({
              nombre: respuesta.nombre,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                queryParams: {
                  ...parametro,
                },
              });
            });
          });
      } else {
        this.sedeService
          .guardarSede(this.formularioSede.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                queryParams: {
                  ...parametro,
                },
              });
            });
          });
      }
    } else {
      this.formularioSede.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.sedeService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.formularioSede.patchValue({
        nombre: respuesta.nombre,
        grupo: respuesta.grupo_id,
      });

      this.changeDetectorRef.detectChanges();
    });
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioSede.patchValue({
      grupo: id,
    });
  }
}
