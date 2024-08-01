import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';

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
  ]
})
export default class ItemFormularioComponent extends General implements OnInit {
  formularioCuenta: FormGroup;
  @Input() informacionFormulario: any;
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(
    private formBuilder: FormBuilder,
    private cuentaService: CuentaService
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
    this.formularioCuenta = this.formBuilder.group({
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioCuenta.controls;
  }

  enviarFormulario() {

    if (this.formularioCuenta.valid) {
      if (this.detalle) {
        // this.cuentaService
        //   .actualizarDatos(this.detalle, this.formularioAsesor.value)
        //   .subscribe((respuesta: any) => {
        //     this.formularioAsesor.patchValue({
        //       nombre_corto: respuesta.nombre_corto,
        //       celular: respuesta.celular,
        //       correo: respuesta.correo,
        //     });
        //     this.alertaService.mensajaExitoso('Se actualizó la información');
        //     this.router.navigate(['/administrador/detalle'], {
        //       queryParams: {
        //         modulo: this.activatedRoute.snapshot.queryParams['modulo'],
        //         modelo: this.activatedRoute.snapshot.queryParams['modelo'],
        //         tipo: this.activatedRoute.snapshot.queryParams['tipo'],
        //         formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
        //         detalle: respuesta.id,
        //         accion: 'detalle',
        //       },
        //     });
        //   });
      } else {
        this.cuentaService
          .guardarCuenta(this.formularioCuenta.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['/administrador/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                detalle: respuesta.id,
                accion: 'detalle',
              },
            });
          });
      }
    } else {
      this.formularioCuenta.markAllAsTouched();
    }

  }

  limpiarFormulario() {
    this.formularioCuenta.reset();
  }

  consultardetalle() {
    this.cuentaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioCuenta.patchValue({
          codigo: respuesta.item.codigo,
          nombre: respuesta.item.nombre,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

}
