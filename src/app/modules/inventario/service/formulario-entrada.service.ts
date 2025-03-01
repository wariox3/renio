import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FechasService } from '@comun/services/fechas.service';

@Injectable({
  providedIn: 'root',
})
export class FormularioEntradaService {
  private _formBuilder = inject(FormBuilder);
  private _fechasService = inject(FechasService);

  constructor() {}

  createForm(): FormGroup {
    const fechaVencimientoInicial =
    this._fechasService.getFechaVencimientoInicial();
    return this._formBuilder.group({
      empresa: [1],
      fecha: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      contacto: ['', Validators.required],
      contactoNombre: [''],
      detalles: this._formBuilder.array([]),
      detalles_eliminados: this._formBuilder.array([]),
      almacen: ['', Validators.required],
      almacenNombre: [''],
      comentario: [null],
      subtotal: [0],
      total: [0]
    });
  }
}
