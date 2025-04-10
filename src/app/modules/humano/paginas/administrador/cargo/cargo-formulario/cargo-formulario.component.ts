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
import { CargoService } from '@modulos/humano/servicios/cargo.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';

@Component({
  selector: 'app-cargo-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SoloNumerosDirective
],
  templateUrl: './cargo-formulario.component.html',
  styleUrl: './cargo-formulario.component.scss',
})
export default class CargoFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  formularioCargo: FormGroup;
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private cargoService: CargoService
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
    this.formularioCargo = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      estado_inactivo: [false],
      codigo: [0, Validators.compose([Validators.required, Validators.maxLength(20)])],
    });
  }

  consultarDetalle() {
    this.cargoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioCargo.patchValue({
          nombre: respuesta.nombre,
          estado_inactivo: respuesta.estado_inactivo,
          codigo: respuesta.codigo,
        });
        this.changeDetectorRef.detectChanges();
      });
  }


  enviarFormulario() {
    if (this.formularioCargo.valid) {
      if (this.detalle) {
        this.cargoService
          .actualizarDatosCargo(this.detalle, this.formularioCargo.value)
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
        this.cargoService
          .guardarCargo(this.formularioCargo.value)
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
            })
          )
          .subscribe();
      }
    } else {
      this.formularioCargo.markAllAsTouched();
    }
  }

}
