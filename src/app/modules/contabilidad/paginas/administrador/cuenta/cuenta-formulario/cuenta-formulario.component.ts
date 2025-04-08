import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { numeroPar } from '@comun/validaciones/numero-par.validator';
import { validarNoIniciaCon } from '@comun/validaciones/validar-primer-caracter.validator';
import {
  RegistroAutocompletarConCuentaClase,
  RegistroAutocompletarConCuentaCuenta,
  RegistroAutocompletarConCuentaGrupo,
} from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { ConCuenta } from '@modulos/contabilidad/interfaces/contabilidad-cuenta.interface';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Subject, takeUntil } from 'rxjs';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-cuenta-formulario',
  standalone: true,
  templateUrl: './cuenta-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SoloNumerosDirective,
  ],
})
export default class ItemFormularioComponent extends General implements OnInit, OnDestroy {
  formularioConCuenta: FormGroup;
  @Input() informacionFormulario: any;
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;
  arrCuentaClase: any = [];

  public cuentaClaseLista: RegistroAutocompletarConCuentaClase[] = [];
  public cuentaGrupoLista: RegistroAutocompletarConCuentaGrupo[] = [];
  public cuentaCuentaLista: RegistroAutocompletarConCuentaCuenta[] = [];

  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private cuentaService: CuentaService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this._iniciarFormulario();
    this._consultarInformacionInicial();
    this._formularioListeners();
    this._deshabilitarSelect('cuenta_cuenta');
    this._deshabilitarSelect('cuenta_grupo');

    if (this.detalle && this.ocultarBtnAtras === false) {
      this._habilitarSelect('cuenta_cuenta');
      this._habilitarSelect('cuenta_grupo');
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

  private _iniciarFormulario() {
    this.formularioConCuenta = this.formBuilder.group({
      codigo: [
        null,
        Validators.compose([
          Validators.maxLength(8),
          cambiarVacioPorNulo.validar,
          numeroPar.validarLongitudPar(),
          validarNoIniciaCon('0'),
        ]),
      ],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      cuenta_clase: [null, [Validators.required]],
      cuenta_grupo: [null, [Validators.required]],
      cuenta_cuenta: [null, [Validators.required]],
      exige_base: [false],
      exige_contacto: [false],
      exige_grupo: [false],
      permite_movimiento: [false],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioConCuenta.controls;
  }

  enviarFormulario() {
    // Verificar si el formulario es válido
    if (this.formularioConCuenta.valid) {
      if (this.detalle) {
        this.cuentaService
          .actualizarDatos(this.detalle, this.formularioConCuenta.value)
          .subscribe({
            next: (respuesta) => {
              this.alertaService.mensajaExitoso('Se actualizó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            },
          });
      } else {
        this.cuentaService
          .guardarCuenta(this.formularioConCuenta.value)
          .subscribe({
            next: (respuesta) => {
              this.alertaService.mensajaExitoso('Se actualizó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            },
          });
      }
    } else {
      this.formularioConCuenta.markAllAsTouched(); // Marcar todos los campos como tocados
    }
  }

  limpiarFormulario() {
    this.formularioConCuenta.reset();
  }

  consultardetalle() {
    this.cuentaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: ConCuenta) => {
        this.formularioConCuenta.patchValue({
          codigo: respuesta.codigo,
          nombre: respuesta.nombre,
          exige_base: respuesta.exige_base,
          exige_contacto: respuesta.exige_contacto,
          exige_grupo: respuesta.exige_grupo,
          permite_movimiento: respuesta.permite_movimiento,
          cuenta_clase: respuesta.cuenta_clase_id,
          cuenta_grupo: respuesta.cuenta_grupo_id,
          cuenta_cuenta: respuesta.cuenta_cuenta_id,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  private _consultarInformacionInicial() {
    this._consultarCuentaClaseLista();
  }

  private _consultarCuentaClaseLista() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConCuentaClase>({
        filtros: [],
        modelo: 'ConCuentaClase',
      })
      .subscribe((response) => {
        this.cuentaClaseLista = response.registros;
      });
  }

  private _consultarCuentaGrupoLista(idDesde: number, idHasta: number) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConCuentaGrupo>({
        filtros: [
          {
            propiedad: 'id',
            operador: 'range',
            valor1: idDesde,
            valor2: idHasta,
          },
        ],
        modelo: 'ConCuentaGrupo',
      })
      .subscribe((response) => {
        this.cuentaGrupoLista = response.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  private _consultarCuentaCuentaLista(idDesde: number, idHasta: number) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConCuentaCuenta>({
        filtros: [
          {
            propiedad: 'id',
            operador: 'range',
            valor1: idDesde,
            valor2: idHasta,
          },
        ],
        limite_conteo: 10000,
        limite: 100,
        desplazar: 0,
        modelo: 'ConCuentaCuenta',
      })
      .subscribe((response) => {
        this.cuentaCuentaLista = response.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  private _listenFormularioCuentaClaseCampo() {
    this.formularioConCuenta
      .get('cuenta_clase')
      ?.valueChanges.subscribe((value) => {
        // limpiamos siempre ante cualquier cambio los siguiente campo
        this.formularioConCuenta.patchValue({
          cuenta_grupo: null,
          cuenta_cuenta: null,
        });

        // si existe un valor habilitamos el siguiente campo y consultamos
        if (value) {
          this._habilitarSelect('cuenta_grupo');
          const rango = this.cuentaService.calcularRangoIds(value, 10, 9);
          this._consultarCuentaGrupoLista(rango.idDesde, rango.idHasta);
          return;
        }

        this._deshabilitarSelect('cuenta_cuenta');
        this._deshabilitarSelect('cuenta_grupo');
      });
  }

  private _listenFormularioCuentaGrupoCampo() {
    this.formularioConCuenta
      .get('cuenta_grupo')
      ?.valueChanges.subscribe((value) => {
        // limpiamos siempre ante cualquier cambio el siguiente campo
        this.formularioConCuenta.patchValue({
          cuenta_cuenta: null,
        });

        // si existe un valor habilitamos el siguiente campo
        if (value) {
          this._habilitarSelect('cuenta_cuenta');
          const rango = this.cuentaService.calcularRangoIds(value, 100, 99);
          this._consultarCuentaCuentaLista(rango.idDesde, rango.idHasta);
          return;
        }

        this._deshabilitarSelect('cuenta_cuenta');
      });
  }

  private _formularioListeners() {
    this._listenFormularioCuentaClaseCampo();
    this._listenFormularioCuentaGrupoCampo();
  }

  private _habilitarSelect(campo: 'cuenta_grupo' | 'cuenta_cuenta') {
    this.formularioConCuenta.get(campo)?.enable();
  }

  private _deshabilitarSelect(campo: 'cuenta_grupo' | 'cuenta_cuenta') {
    this.formularioConCuenta.get(campo)?.disable();
  }
}
