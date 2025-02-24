import {
  ChangeDetectionStrategy,
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
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { Impuesto } from '@modulos/general/interfaces/impuesto.interface';
import { ImpuestoService } from '@modulos/general/servicios/impuesto.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-impuesto-editar',
  standalone: true,
  imports: [
    CuentasComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './impuesto-editar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpuestoEditarComponent extends General implements OnInit {
  formularioImpuestoEditarCuenta: FormGroup;

  private _formBuilder = inject(FormBuilder);
  private _impuestoService = inject(ImpuestoService);

  @Input() impuestoInformacion: Impuesto;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.consultardetalle();
  }

  iniciarFormulario() {
    this.formularioImpuestoEditarCuenta = this._formBuilder.group({
      cuenta_id: [''],
      cuenta_codigo: [''],
      cuenta_nombre: [''],
    });
  }

  consultardetalle() {
    this._impuestoService
      .consultarDetalle(this.impuestoInformacion.id)
      .subscribe((respuesta) => {
        this.formularioImpuestoEditarCuenta.patchValue({
          cuenta_id: respuesta.cuenta_id,
          cuenta_codigo: respuesta.cuenta_codigo,
          cuenta_nombre: respuesta.cuenta_nombre,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  limpiarCuentaSeleccionada() {
    this.formularioImpuestoEditarCuenta.patchValue({
      cuenta_id: '',
      cuenta_codigo: '',
      cuenta_nombre: '',
    });
  }

  agregarCuentaSeleccionado(cuenta: any) {
    this.formularioImpuestoEditarCuenta.patchValue({
      cuenta_id: cuenta.cuenta_id,
      cuenta_codigo: cuenta.cuenta_codigo,
      cuenta_nombre: cuenta.cuenta_nombre,
    });
    this.formularioImpuestoEditarCuenta.markAsTouched();
    this.formularioImpuestoEditarCuenta.markAsDirty();
  }

  enviarFormulario() {
    this._impuestoService
      .actualizarCuenta(this.impuestoInformacion.id, {
        cuenta: this.formularioImpuestoEditarCuenta.get('cuenta_id')?.value,
      })
      .subscribe(() => {
        this.emitirGuardoRegistro.emit(true); // necesario para cerrar el modal que está en editarEmpresa
      });
  }
}
