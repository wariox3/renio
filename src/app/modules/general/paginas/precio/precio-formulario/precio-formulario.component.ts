import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { PrecioService } from '@modulos/general/servicios/precio.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Subject, takeUntil } from 'rxjs';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-precio-formulario',
  standalone: true,
  templateUrl: './precio-formulario.component.html',
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
  ],
})
export default class PrecioFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioPrecio: FormGroup;
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private precioService: PrecioService
  ) {
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
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    this.formularioPrecio = this.formBuilder.group({
      tipo: ['', Validators.compose([Validators.required, Validators.maxLength(1)])],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      fecha_vence: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ],
      detalles: this.formBuilder.array([]),
    });
  }

  get detalles() {
    return this.formularioPrecio.get('detalles') as FormArray;
  }

  enviarFormulario() {
    if (this.formularioPrecio.valid) {
      if (this.detalle) {
        this.precioService
          .actualizarDatos(this.detalle, this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
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
        this.precioService
          .guardarPrecio(this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
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
      this.formularioPrecio.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioPrecio.patchValue({
          nombre: respuesta.nombre,
          tipo: respuesta.tipo,
          fecha_vence: respuesta.fecha_vence,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
