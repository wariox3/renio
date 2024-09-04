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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
    private cuentaService: CuentaService // private httpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioConCuenta = this.formBuilder.group({
      codigo: [null, Validators.compose([Validators.maxLength(20), cambiarVacioPorNulo.validar])],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      cuenta_clase: [null],
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
    if (this.formularioConCuenta.valid) {
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
      this.formularioConCuenta.markAllAsTouched();
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

}
