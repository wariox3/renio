import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CuentaBancoComponent } from '@comun/componentes/cuenta-banco/cuenta-banco.component';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { PagoFormulario } from '@interfaces/comunes/factura/factura.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-factura-formulario-pagos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CuentaBancoComponent,
    TranslateModule,
  ],
  templateUrl: './factura-formulario-pagos.component.html',
  styleUrl: './factura-formulario-pagos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaFormularioPagosComponent extends General {
  @Input({ required: true }) formularioFactura!: FormGroup;
  @Input({ required: true }) estadoAprobado: boolean = false;

  private _formBuilder = inject(FormBuilder);

  public themeValue = localStorage.getItem('kt_theme_mode_value');

  constructor() {
    super();
  }

  // TODO: Eliminar
  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  agregarPago() {
    if (this.detalles.length > 0) {
      const pagoFormGroup = this._formBuilder.group({
        cuenta_banco: [null, Validators.compose([Validators.required])],
        cuenta_banco_nombre: [null],
        pago: [
          0,
          [
            validarPrecio(),
            Validators.min(1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        pagos_eliminados: this._formBuilder.array([]),
        id: [null],
      });
      this.pagos.push(pagoFormGroup);
      this.pagos?.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
    } else {
      this.alertaService.mensajeError('Error', 'Se requieren agragar detalles');
    }
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  eliminarPago(index: number, id: number | null) {
    if (id !== null) {
      this.pagosEliminados.value.push(id);
    }

    this.pagos.removeAt(index);
    this._limpiarTotalAfectado();
    this._calcularTotalPagos();
    this.changeDetectorRef.detectChanges();
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  agregarPagoSeleccionado(item: any, index: number) {
    this.pagos.controls[index].patchValue({
      cuenta_banco: item.cuenta_banco_id,
      cuenta_banco_nombre: item.cuenta_banco_nombre,
    });
    const pagoFormGroup = this.pagos.at(index) as FormGroup;

    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  // TODO: Preguntar sobre esta logica (se requiere en todos los componentes?)
  actualizarDetallePago(index: number, campo: string, evento: any) {
    const pagoFormGroup = this.pagos.at(index) as FormGroup;
    const valor = parseFloat(evento.target.value);

    if (evento.target.value !== '') {
      if (valor < 0) {
        pagoFormGroup.get(campo)?.patchValue(0);
      } else {
        const valorRedondeado = this.redondear(valor, 2);
        if (valorRedondeado <= this.totalGeneral.value) {
          pagoFormGroup.get(campo)?.patchValue(valorRedondeado);
        } else {
          this.alertaService.mensajeError(
            'Error',
            'El valor ingresado del pago es mayor al total general'
          );
        }
      }
    } else {
      pagoFormGroup.get(campo)?.patchValue(0);
    }

    if (this.totalAfectado.value > this.totalGeneral.value) {
      this.alertaService.mensajeError(
        'Error',
        'Los pagos agregados son superiores al total de la factura'
      );
    }

    this._limpiarTotalAfectado();
    this._calcularTotalPagos();
    this.changeDetectorRef.detectChanges();
  }

  private _calcularTotalPagos() {
    let total: number = 0;
    this.pagos.value.forEach((pagoRealizado: PagoFormulario) => {
      total += pagoRealizado.pago;
    });

    this.totalAfectado.setValue(total);
  }

  private _limpiarTotalAfectado() {
    this.totalAfectado.setValue(0);
  }

  get pagos() {
    return this.formularioFactura.get('pagos') as FormArray;
  }

  get totalGeneral() {
    return this.formularioFactura.get('total') as FormControl;
  }

  get totalAfectado() {
    return this.formularioFactura.get('afectado') as FormControl;
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  get pagosEliminados() {
    return this.formularioFactura.get('pagos_eliminados') as FormArray;
  }
}
