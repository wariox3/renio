// src/app/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarCantidad(permiteCeros: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!permiteCeros) {
      const castedValue = Number(control.value || 0);
      if (castedValue <= 0) {
        return { valorCero: true };
      }
    }
    return null;
  };
}
