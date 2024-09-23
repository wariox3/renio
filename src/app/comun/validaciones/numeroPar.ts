import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class numeroPar {
  static validarLongitudPar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.length % 2 !== 0) {
        return { longitudImpar: true };
      }
      return null;
    };
  }
}
