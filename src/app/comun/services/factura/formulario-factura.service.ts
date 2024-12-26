import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FechasService } from '../fechas.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';

@Injectable({
  providedIn: 'root',
})
export class FormularioFacturaService {
  constructor(
    private _formBuilder: FormBuilder,
    private _fechasService: FechasService
  ) {}

  createForm(): FormGroup {
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();
    return this._formBuilder.group(
      {
        empresa: [1],
        contacto: ['', Validators.required],
        totalCantidad: [0],
        contactoNombre: [''],
        numero: [null],
        fecha: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_vence: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        metodo_pago: [1, Validators.required],
        metodo_pago_nombre: [''],
        total: [0],
        subtotal: [0],
        base_impuesto: [0],
        impuesto: [0],
        impuesto_operado: [0],
        impuesto_retencion: [0],
        afectado: [0],
        total_bruto: [0],
        comentario: [null, Validators.maxLength(500)],
        orden_compra: [null, Validators.maxLength(50)],
        documento_referencia: [null],
        documento_referencia_numero: [null],
        asesor: [''],
        asesor_nombre_corto: [null],
        sede: [''],
        descuento: [0],
        sede_nombre: [null],
        plazo_pago: [1, Validators.required],
        detalles: this._formBuilder.array([]),
        pagos: this._formBuilder.array([]),

        referencia_cue: [null, [Validators.maxLength(150)]], // Referencia CUE
        referencia_numero: [null, [cambiarVacioPorNulo.validar]], // Referencia número
        referencia_prefijo: [null, [Validators.maxLength(50)]], // Referencia prefijo

        detalles_eliminados: this._formBuilder.array([]),
        pagos_eliminados: this._formBuilder.array([]),
      },
      {
        validator: this.validarFecha,
      }
    );
  }

  validarFecha(control: AbstractControl) {
    const fecha = control.get('fecha')?.value;
    const fecha_vence = control.get('fecha_vence')?.value;

    if (fecha > fecha_vence) {
      control.get('fecha')?.setErrors({ fechaSuperiorNoValida: true });
    } else {
      if (control.get('fecha_vence')?.getError('fechaVenceInferiorNoValida')) {
        control.get('fecha_vence')?.setErrors(null);
      }
    }

    if (fecha_vence < fecha) {
      control
        .get('fecha_vence')
        ?.setErrors({ fechaVenceInferiorNoValida: true });
    } else {
      if (control.get('fecha')?.getError('fechaSuperiorNoValida')) {
        control.get('fecha')?.setErrors(null);
      }
    }
  }
}
