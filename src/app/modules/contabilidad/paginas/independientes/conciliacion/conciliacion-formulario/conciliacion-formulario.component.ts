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
import { CuentaBancoService } from '@modulos/general/servicios/cuenta-banco.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, Subject, takeUntil, tap, throttleTime, zip } from 'rxjs';
import { GeneralService } from '@comun/services/general.service';
import {
  RegistroAutocompletarGenCuentaBancoClase,
  RegistroAutocompletarGenCuentaBancoTipo,
} from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';

@Component({
  selector: 'app-conciliacion-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbDropdownModule,
    NgSelectModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  templateUrl: './conciliacion-formulario.component.html',
  styleUrl: './conciliacion-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConciliacionFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioConciliacion: FormGroup;
  arrCuentasTipos: RegistroAutocompletarGenCuentaBancoTipo[];
  arrCuentasBancos: RegistroAutocompletarGenCuentaBancoClase[];
  selectedDateIndex: number = -1;
  visualizarCampoNumeroCuenta = false;
  public cuentaCobrarCodigo = '';
  public cuentaCobrarNombre = '';
  public ciudadDropdown: NgbDropdown;
  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private conciliacionService: ConciliacionService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.consultarInformacion();
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

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarGenCuentaBancoTipo[]>(
        'general/cuenta_banco_tipo/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenCuentaBancoClase[]>(
        'general/cuenta_banco_clase/seleccionar/',
      )
    ).subscribe((respuesta) => {
      this.arrCuentasTipos = respuesta[0];
      this.arrCuentasBancos = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  iniciarFormulario() {
    this.formularioConciliacion = this.formBuilder.group({
      nombre: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      fecha_desde: [
        null,
        Validators.compose([Validators.required]),
      ],
      fecha_hasta: [
        null,
        Validators.compose([Validators.required]),
      ],
      cuenta_banco: [
        null,
        Validators.compose([Validators.required]),
      ],
    });
  }

  enviarFormulario() {
    if (this.formularioConciliacion.valid) {
      if (this.detalle) {

        this.conciliacionService
          .actualizarDatos(this.detalle, this.formularioConciliacion.value)
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
      } else {
        this.conciliacionService
          .guardarConciliacion(this.formularioConciliacion.value)
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
      this.formularioConciliacion.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.conciliacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioConciliacion.patchValue({
          nombre: respuesta.nombre,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          cuenta_banco: respuesta.cuenta_banco,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioConciliacion?.markAsDirty();
    this.formularioConciliacion?.markAsTouched();

    // if (campo === 'cuenta_banco_tipo') {
    //   if (dato === null) {
    //     this.formularioConciliacion.get('cuenta_banco_tipo')?.setValue(null);
    //     this.visualizarCampoNumeroCuenta = false;
    //     this.changeDetectorRef.detectChanges();
    //   } else {
    //     if (dato !== 3) {
    //       this.visualizarCampoNumeroCuenta = true;
    //       this.formularioCuentaBanco
    //         .get('numero_cuenta')
    //         ?.setValidators([Validators.required, Validators.maxLength(50)]);
    //       this.formularioCuentaBanco
    //         .get('cuenta_banco_clase')
    //         ?.setValidators([Validators.required]);
    //       this.changeDetectorRef.detectChanges();
    //     } else {
    //       this.visualizarCampoNumeroCuenta = false;
    //       this.formularioCuentaBanco.get('numero_cuenta')?.clearValidators();
    //       this.formularioCuentaBanco
    //         .get('cuenta_banco_clase')
    //         ?.clearValidators();
    //       this.formularioCuentaBanco
    //         .get('numero_cuenta')
    //         ?.setValidators([Validators.maxLength(50)]);
    //       this.formularioCuentaBanco
    //         .get('numero_cuenta')
    //         ?.updateValueAndValidity();
    //       this.changeDetectorRef.detectChanges();
    //       this.formularioCuentaBanco.get('cuenta_banco_clase')?.setValue(null);
    //     }
    //   }
    // }
    this.changeDetectorRef.detectChanges();
  }
}
