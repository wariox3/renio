import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { HttpService } from '@comun/services/http.service';
import { ConCuenta } from '@interfaces/contabilidad/contabilidad-cuenta.interface';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campoNoObligatorio';
import { numeroPar } from '@comun/validaciones/numeroPar';

@Component({
  selector: 'app-cuenta-formulario',
  standalone: true,
  templateUrl: './cuenta-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    BtnAtrasComponent,
    CardComponent,
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

  constructor(
    private formBuilder: FormBuilder,
    private cuentaService: CuentaService,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }

    this.formularioConCuenta.get('codigo')?.valueChanges.subscribe((value: string) => {
      if (value && value.length > 0) {
        this.formularioConCuenta.get('cuenta_clase')?.setValue(value.charAt(0));
        this.validarCuentaClase(value.substring(0, 2))

        if (value.length >= 2) {
          this.formularioConCuenta.get('cuenta_grupo')?.setValue(value.substring(0, 2));
          this.validarGrupo(value.substring(0, 2))
        } else {
          this.formularioConCuenta.get('cuenta_grupo')?.setValue('');
          this.validarGrupo(value.substring(0, 2))

        }
        if (value.length >= 4) {
          this.formularioConCuenta.get('cuenta_subcuenta')?.setValue(value.substring(0, 4));
          this.validarSubCuenta(value.substring(0, 2))

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
      codigo: [null, Validators.compose([Validators.maxLength(8), cambiarVacioPorNulo.validar, numeroPar.validarLongitudPar()])],
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
      const cuentaSubcuenta = this.formularioConCuenta.get('cuenta_subcuenta')?.value;

      if (!cuentaClase || !cuentaGrupo || !cuentaSubcuenta) {
        this.alertaService.mensajeError('Error', 'Los campos de clase, grupo y subcuenta son obligatorios.');
        return;
      }

      // Proceder con el guardado
      if (this.detalle) {
        this.cuentaService
          .actualizarDatos(this.detalle, this.formularioConCuenta.value)
          .subscribe((respuesta: ConCuenta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
          });
      } else {
        this.cuentaService
          .guardarCuenta(this.formularioConCuenta.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
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
          exige_tercero: respuesta.exige_tercero,
          exige_grupo: respuesta.exige_grupo,
          permite_movimiento: respuesta.permite_movimiento,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  validarCuentaClase(grupo: string){
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'ConCuenta',
        }
      )
      .subscribe((respuesta) => {
        if(respuesta){
          this.formularioConCuenta.get('cuenta_clase')?.setErrors({ grupoNoValido: true });
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  validarGrupo(grupo: string){
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'ConCuenta',
        }
      )
      .subscribe((respuesta) => {
        if(respuesta){
          this.formularioConCuenta.get('cuenta_grupo')?.setErrors({ grupoNoValido: true });
          this.changeDetectorRef.detectChanges();
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  validarSubCuenta(grupo: string){
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'ConCuenta',
        }
      )
      .subscribe((respuesta) => {
        if(respuesta){
          this.formularioConCuenta.get('cuenta_subcuenta')?.setErrors({ grupoNoValido: true });
          this.changeDetectorRef.detectChanges();
        }
      });
  }

}
