import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../../../comun/componentes/cuentas/cuentas.component';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';
import { AlertaService } from '@comun/services/alerta.service';

@Component({
  selector: 'app-modal-transladar-movimientos',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CuentasComponent,
    CommonModule,
  ],
  templateUrl: './modal-transladar-movimientos.component.html',
})
export class ModalTransladarMovimientosComponent extends General {
  formularioTranslado: FormGroup;
  private _modalService = inject(NgbModal);
  private _formBuilder = inject(FormBuilder);
  private _cuentaService = inject(CuentaService);
  private _alertaService = inject(AlertaService);

  @Input() cuentaId: number;
  @Input() codigoCuenta: string;
  @ViewChild('contentModal') contentModal: TemplateRef<any>;

  constructor() {
    super();
  }

  abrirModal() {
    this.iniciarFormulario();
    this._modalService.open(this.contentModal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  iniciarFormulario() {
    this.formularioTranslado = this._formBuilder.group({
      cuenta_destino_id: [this.cuentaId],
      cuenta_origen_id: ['', Validators.compose([Validators.required])],
      cuenta_origen_codigo: [''],
      cuenta_origen_nombre: [''],
    });
  }

  enviarFormulario() {
    if (this.formularioTranslado.valid) {
      this.alertaService
        .confirmar({
          titulo: '¿Está seguro de trasladar los movimientos a esta nueva cuenta?',
          texto: 'Esta acción no se puede revertir.',
          textoBotonCofirmacion: 'Si, transladar',
        })
        .then((respuesta) => {
          if (respuesta.isConfirmed) {
            this._cuentaService
              .traslado({
                cuenta_destino_id: this.formularioTranslado.get(
                  'cuenta_destino_id'
                )?.value,
                cuenta_origen_id: this.formularioTranslado.get(
                  'cuenta_origen_id'
                )?.value,
              })
              .subscribe((respuesta) => {
                if(respuesta.mensaje){
                  this.alertaService.mensajaExitoso(respuesta.mensaje)
                }
                this._modalService.dismissAll();
              });
          }
        });
    } else {
      this.formularioTranslado.markAllAsTouched(); // Marcar todos los campos como tocados
    }
  }

  agregarCuentaSeleccionado(cuenta: any) {
    this.formularioTranslado.patchValue({
      cuenta_origen_id: cuenta.cuenta_id,
      cuenta_origen_codigo: cuenta.cuenta_codigo,
      cuenta_origen_nombre: cuenta.cuenta_nombre,
    });
    this.formularioTranslado.markAsTouched();
    this.formularioTranslado.markAsDirty();
  }
}
