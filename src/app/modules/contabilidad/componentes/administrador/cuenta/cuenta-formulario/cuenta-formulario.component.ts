import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
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
import { GeneralService } from '@comun/services/general.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio';
import { numeroPar } from '@comun/validaciones/numero-par';
import { ConCuenta } from '@interfaces/contabilidad/contabilidad-cuenta.interface';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-cuenta-formulario',
  standalone: true,
  templateUrl: './cuenta-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
})
export default class ItemFormularioComponent extends General implements OnInit {
  formularioConCuenta: FormGroup;
  @Input() informacionFormulario: any;
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;
  arrCuentaClase: any = [];

  private readonly _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private cuentaService: CuentaService,
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }

    this.formularioConCuenta
      .get('codigo')
      ?.valueChanges.subscribe((value: string) => {
        if (value && value.length > 0) {
          this.formularioConCuenta
            .get('cuenta_clase')
            ?.setValue(value.charAt(0));
          if (value.length >= 2) {
            this.formularioConCuenta
              .get('cuenta_grupo')
              ?.setValue(value.substring(0, 2));
            this.validarGrupo(value.substring(0, 2));
          } else {
            this.formularioConCuenta.get('cuenta_grupo')?.setValue('');
          }
          if (value.length >= 4) {
            this.formularioConCuenta
              .get('cuenta_subcuenta')
              ?.setValue(value.substring(0, 4));
          } else {
            this.formularioConCuenta.get('cuenta_subcuenta')?.setValue('');
          }

          let nivel = 1;
          if (value.length > 1 && value.length <= 2) {
            nivel = 2;
          } else if (value.length > 2 && value.length <= 4) {
            nivel = 3;
          } else if (value.length > 4 && value.length <= 6) {
            nivel = 4;
          } else if (value.length > 6 && value.length <= 8) {
            nivel = 5;
          }

          this.formularioConCuenta.get('nivel')?.setValue(nivel);
        } else {
          this.formularioConCuenta.get('cuenta_clase')?.setValue('');
          this.formularioConCuenta.get('cuenta_grupo')?.setValue('');
          this.formularioConCuenta.get('cuenta_subcuenta')?.setValue('');
          this.formularioConCuenta.get('nivel')?.setValue(null);
        }
      });
  }

  iniciarFormulario() {
    this.formularioConCuenta = this.formBuilder.group({
      codigo: [
        null,
        Validators.compose([
          Validators.maxLength(8),
          cambiarVacioPorNulo.validar,
          numeroPar.validarLongitudPar(),
        ]),
      ],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      cuenta_clase: [null],
      cuenta_grupo: [null],
      cuenta_subcuenta: [null],
      nivel: [null],
      exige_base: [false],
      exige_tercero: [false],
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
      // Validar que los campos clase, grupo y subcuenta no estén vacíos
      const cuentaClase = this.formularioConCuenta.get('cuenta_clase')?.value;
      const cuentaGrupo = this.formularioConCuenta.get('cuenta_grupo')?.value;
      const cuentaSubcuenta =
        this.formularioConCuenta.get('cuenta_subcuenta')?.value;

      if (!cuentaClase || !cuentaGrupo || !cuentaSubcuenta) {
        this.alertaService.mensajeError(
          'Error',
          'Los campos de clase, grupo y subcuenta son obligatorios.'
        );
        return;
      }

      forkJoin([
        this.validarCuentaClase(
          this.formularioConCuenta.get('codigo')?.value.charAt(0)
        ),
        this.validarGrupo(
          this.formularioConCuenta.get('codigo')?.value.substring(0, 2)
        ),
        this.validarSubCuenta(
          this.formularioConCuenta.get('codigo')?.value.substring(0, 4)
        ),
      ])
        .pipe(
          map((respuesta) => {
            let errores = false;
            if (respuesta[0].registros.length > 0) {
              this.formularioConCuenta.get('cuenta_clase')?.setErrors(null);
            } else {
              errores = true;
              this.formularioConCuenta
                .get('cuenta_clase')
                ?.setErrors({ grupoNoValido: true });
              this.changeDetectorRef.detectChanges();
            }
            if (respuesta[1].registros.length > 0) {
              this.formularioConCuenta.get('cuenta_grupo')?.setErrors(null);
            } else {
              errores = true;
              this.formularioConCuenta
                .get('cuenta_grupo')
                ?.setErrors({ grupoNoValido: true });
              this.changeDetectorRef.detectChanges();
            }
            if (respuesta[2].registros.length > 0) {
              this.formularioConCuenta.get('cuenta_subcuenta')?.setErrors(null);
            } else {
              errores = true;
              this.formularioConCuenta
                .get('cuenta_subcuenta')
                ?.setErrors({ grupoNoValido: true });
              this.changeDetectorRef.detectChanges();
            }
            return errores;
          }),
          switchMap((respuestaErrores) => {
            if (respuestaErrores === false) {
              if (this.detalle) {
                return this.cuentaService.actualizarDatos(
                  this.detalle,
                  this.formularioConCuenta.value
                );
              } else {
                return this.cuentaService.guardarCuenta(
                  this.formularioConCuenta.value
                );
              }
            } else {
              return of(null);
            }
          }),
          tap((respuesta) => {
            if (respuesta) {
              if (this.detalle) {
                this.alertaService.mensajaExitoso(
                  'Se actualizó la información'
                );
              } else {
                this.alertaService.mensajaExitoso(
                  'Se actualizó la información'
                );
              }
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta?.id,
                  },
                });
              });
            }
          })
        )
        .subscribe();
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
          exige_tercero: respuesta.exige_tercero,
          exige_grupo: respuesta.exige_grupo,
          permite_movimiento: respuesta.permite_movimiento,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  validarCuentaClase(cuentaClase: string) {
    return this._generalService.consultarDatosAutoCompletar<any>({
      filtros: [{ propiedad: 'id', valor1: cuentaClase }],
      modelo: 'ConCuentaClase',
    });
  }

  validarGrupo(grupo: string) {
    return this._generalService.consultarDatosAutoCompletar<any>({
      filtros: [{ propiedad: 'id', valor1: grupo }],
      modelo: 'ConCuentaGrupo',
    });
  }

  validarSubCuenta(subClase: string) {
    return this._generalService.consultarDatosAutoCompletar<any>({
      filtros: [{ propiedad: 'id', valor1: subClase }],
      modelo: 'ConCuentaSubcuenta',
    });
  }
}
