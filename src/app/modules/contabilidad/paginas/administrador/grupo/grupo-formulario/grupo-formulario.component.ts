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
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';
import { GrupoService } from '@modulos/contabilidad/servicios/grupo.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
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
  ],
  templateUrl: './grupo-formulario.component.html',
  styleUrl: './grupo-formulario.component.scss',
})
export default class GrupoFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  formularioConGrupo: FormGroup;

  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private grupoService: GrupoService
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
    this.formularioConGrupo = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
    });
  }

  formSubmit() {
    if (this.formularioConGrupo.valid) {
      if (this.detalle) {
        this.grupoService
          .actualizarDatos(this.detalle, this.formularioConGrupo.value)
          .subscribe((respuesta: ConGrupo) => {
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
        this.grupoService
          .guardarGrupo(this.formularioConGrupo.value)
          .pipe(
            tap((respuesta: ConGrupo) => {
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
      this.formularioConGrupo.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: ConGrupo) => {
        this.formularioConGrupo.patchValue({
          nombre: respuesta.nombre,
          codigo: respuesta.codigo,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
