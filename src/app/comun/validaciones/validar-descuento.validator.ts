// src/app/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarDescuento(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const castedValue = Number(control.value || 0);
    if (castedValue < 0 || control.value === null) {
      return { valorCero: true };
    }
    return null;
  };
}
