import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { GeneralService } from '@comun/services/general.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { SucursalService } from '@modulos/humano/servicios/Sucursal.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-sucursal-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgSelectModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  templateUrl: './sucursal-formulario.component.html',
})
export default class SucursalFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioSucursal: FormGroup;
  private _generalService = inject(GeneralService);
  private _formBuilder = inject(FormBuilder);
  private _sucursalService = inject(SucursalService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor() {
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
    this.formularioSucursal = this._formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(80)]),
      ],
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
    });
  }

  enviarFormulario() {
    if (this.formularioSucursal.valid) {
      if (this.detalle) {
        this._sucursalService
          .actualizarSucursal(this.detalle, this.formularioSucursal.value)
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
        this._sucursalService
          .guardarSucursal(this.formularioSucursal.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioSucursal.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this._sucursalService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioSucursal.patchValue({
          nombre: respuesta.nombre,
          codigo: respuesta.codigo,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
