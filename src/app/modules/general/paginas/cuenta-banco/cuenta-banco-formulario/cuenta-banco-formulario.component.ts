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
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { GeneralService } from '@comun/services/general.service';
import {
  RegistroAutocompletarGenCuentaBancoClase,
  RegistroAutocompletarGenCuentaBancoTipo,
} from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { CuentasComponent } from '../../../../../comun/componentes/cuentas/cuentas.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-cuenta-banco-formulario',
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
    CuentasComponent,
  ],
  templateUrl: './cuenta-banco-formulario.component.html',
  styleUrl: './cuenta-banco-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CuentaBancoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioCuentaBanco: FormGroup;
  arrCuentasTipos: any[];
  arrCuentasBancos: any[];
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
    private cuentaBancoService: CuentaBancoService
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

    this.formularioCuentaBanco
      .get('cuenta_banco_tipo')
      ?.valueChanges.subscribe((valor) => {
        this.modificarCampoFormulario('cuenta_banco_tipo', valor);
      });
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
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBancoTipo>(
        {
          modelo: 'GenCuentaBancoTipo',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBancoClase>(
        {
          modelo: 'GenCuentaBancoClase',
          serializador: 'ListaAutocompletar',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrCuentasTipos = respuesta[0].registros;
      this.arrCuentasBancos = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  iniciarFormulario() {
    this.formularioCuentaBanco = this.formBuilder.group({
      nombre: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      numero_cuenta: [null, Validators.compose([Validators.maxLength(50)])],
      cuenta_banco_tipo: [null, Validators.compose([Validators.required])],
      cuenta_banco_clase: ['', Validators.compose([Validators.required])],
      cuenta: [''],
    });
  }

  enviarFormulario() {
    if (this.formularioCuentaBanco.valid) {
      if (this.detalle) {

        if (this.formularioCuentaBanco.get('cuenta_banco_tipo')?.value === 3) {
          this.formularioCuentaBanco.patchValue({
            numero_cuenta: null,
            cuenta_banco_clase: null,
          });
        }

        this.cuentaBancoService
          .actualizarDatos(this.detalle, this.formularioCuentaBanco.value)
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
        this.cuentaBancoService
          .guardarCuentaBanco(this.formularioCuentaBanco.value)
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
      this.formularioCuentaBanco.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.cuentaBancoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioCuentaBanco.patchValue({
          cuenta_banco_tipo: respuesta.cuenta_banco_tipo_id,
          cuenta_banco_clase: respuesta.cuenta_banco_clase_id,
          nombre: respuesta.nombre,
          numero_cuenta: respuesta.numero_cuenta,
          cuenta: respuesta.cuenta_id,
        });

        this.cuentaCobrarCodigo = respuesta.cuenta_codigo;
        this.cuentaCobrarNombre = respuesta.cuenta_nombre;
        if (respuesta.cuenta_banco_tipo_id !== 3) {
          this.visualizarCampoNumeroCuenta = true;
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.required, Validators.maxLength(50)]);
          this.changeDetectorRef.detectChanges();
        } else {
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.clearValidators();
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.updateValueAndValidity();
          this.formularioCuentaBanco.get('numero_cuenta')?.clearValidators();
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.updateValueAndValidity();
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  consultarCiudad(event: any) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBancoTipo>({
        filtros: [
          {
            propiedad: 'nombre__icontains',
            valor1: `${event?.target.value}`,
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenCuentaBancoTipo',
        serializador: 'ListaAutocompletar',
      })
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCuentasTipos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioCuentaBanco?.markAsDirty();
    this.formularioCuentaBanco?.markAsTouched();

    if (campo === 'cuenta_banco_tipo') {
      if (dato === null) {
        this.formularioCuentaBanco.get('cuenta_banco_tipo')?.setValue(null);
        this.visualizarCampoNumeroCuenta = false;
        this.changeDetectorRef.detectChanges();
      } else {
        if (dato !== 3) {
          this.visualizarCampoNumeroCuenta = true;
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.required, Validators.maxLength(50)]);
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.setValidators([Validators.required]);
          this.changeDetectorRef.detectChanges();
        } else {
          this.visualizarCampoNumeroCuenta = false;
          this.formularioCuentaBanco.get('numero_cuenta')?.clearValidators();
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.clearValidators();
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.maxLength(50)]);
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.updateValueAndValidity();
          this.changeDetectorRef.detectChanges();
          this.formularioCuentaBanco.get('cuenta_banco_clase')?.setValue(null);
        }
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  agregarCuentaSeleccionado(cuenta: any) {
    this.formularioCuentaBanco.get('cuenta')?.setValue(cuenta.cuenta_id);
    this.cuentaCobrarNombre = cuenta.cuenta_nombre;
    this.cuentaCobrarCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaSeleccionado() {
    this.formularioCuentaBanco.get('cuenta')?.setValue(null);
    this.cuentaCobrarNombre = '';
    this.cuentaCobrarCodigo = '';
    this.changeDetectorRef.detectChanges();
  }
}
