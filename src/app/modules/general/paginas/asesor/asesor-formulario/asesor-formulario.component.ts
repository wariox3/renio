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
import { AsesorService } from '@modulos/general/servicios/asesor.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Subject, takeUntil } from 'rxjs';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-asesor-formulario',
  standalone: true,
  templateUrl: './asesor-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgxMaskDirective,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    InputValueCaseDirective
  ],
  providers: [provideNgxMask()],
})
export default class AsesorFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioAsesor: FormGroup;
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private asesorService: AsesorService
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
    this.formularioAsesor = this.formBuilder.group({
      nombre_corto: [null, Validators.compose([])],
      celular: [
        null,
        Validators.compose([]),
      ],
      correo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioAsesor.controls;
  }

  enviarFormulario() {
    if (this.formularioAsesor.valid) {
      if (this.detalle) {
        this.asesorService
          .actualizarDatos(this.detalle, this.formularioAsesor.value)
          .subscribe((respuesta) => {
            this.formularioAsesor.patchValue({
              nombre_corto: respuesta.nombre_corto,
              celular: respuesta.celular,
              correo: respuesta.correo,
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
        this.asesorService
          .guardarAsesor(this.formularioAsesor.value)
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
      this.formularioAsesor.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.asesorService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioAsesor.patchValue({
          nombre_corto: respuesta.nombre_corto,
          celular: respuesta.celular,
          correo: respuesta.correo,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
