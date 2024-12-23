// src/app/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarPrecio(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const castedValue = Number(control.value || 0);
    if (castedValue <= 0) {
      return { valorCero: true };
    }
    return null;
  };
}
