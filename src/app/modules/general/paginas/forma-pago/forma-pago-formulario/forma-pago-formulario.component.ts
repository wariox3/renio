import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
import { FormaPagoService } from '@modulos/general/servicios/forma-pago.service';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../comun/componentes/cuentas/cuentas.component';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-forma-pago-nuevo',
  standalone: true,
  templateUrl: './forma-pago-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbModalModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    CuentasComponent,
  ],
  providers: [NgbActiveModal],
})
export default class FormaPagoFormularioComponent
  extends General
  implements OnInit
{
  public cuentaCodigo = '';
  public cuentaNombre = '';

  private readonly _formaPagoService = inject(FormaPagoService);

  formularioFormaPago: FormGroup;
  @Input() ocultarBtnAtras: Boolean = false;
  @Input() tipoRolucion: 'compra' | 'venta' | null = null;
  @Input() tituloFijo: Boolean = false;
  @Input() editarInformacion: Boolean = false;
  @Input() idEditarInformacion: number | null = null;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle || this.editarInformacion) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioFormaPago = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      cuenta: ['', Validators.compose([])],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioFormaPago.controls;
  }

  enviarFormulario() {
    if (this.formularioFormaPago.valid) {
      if (this.detalle || this.idEditarInformacion) {
        this._formaPagoService
          .actualizarDatos(this.detalle, {
            ...this.formularioFormaPago.value,
          })
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            }
          });
      } else {
        this._formaPagoService
          .guardar({
            ...this.formularioFormaPago.value,
          })
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            }
          });
      }
    } else {
      this.formularioFormaPago.markAllAsTouched();
    }
  }

  consultardetalle() {
    let formaPagoId = this.detalle;

    if (this.idEditarInformacion !== null) {
      formaPagoId = this.idEditarInformacion;
    }

    this._formaPagoService
      .consultarDetalle(formaPagoId)
      .subscribe((respuesta) => {
        this.formularioFormaPago.patchValue({
          nombre: respuesta.nombre,
          cuenta: respuesta.cuenta_id,
        });

        this.cuentaNombre = respuesta.cuenta_nombre;
        this.cuentaCodigo = respuesta.cuenta_codigo;

        this.changeDetectorRef.detectChanges();
      });
  }

  agregarCuentaCobrarSeleccionado(cuenta: any) {
    this.formularioFormaPago.get('cuenta')?.setValue(cuenta.cuenta_id);
    this.cuentaNombre = cuenta.cuenta_nombre;
    this.cuentaCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaCobrarSeleccionado() {
    this.formularioFormaPago.get('cuenta')?.setValue(null);
    this.cuentaNombre = '';
    this.cuentaCodigo = '';
    this.changeDetectorRef.detectChanges();
  }
}
