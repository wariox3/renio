import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CampoNoCeroValidator {
  static validar(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);

    if (value === 0) {
      return { valorCeroNoPermitido: true };
    }

    return null;
  }
}