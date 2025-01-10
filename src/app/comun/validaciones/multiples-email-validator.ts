import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class MultiplesEmailValidator {
  static validarCorreos(campos: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      campos.forEach((campo) => {
        let campoValor = formGroup.get(campo)?.value;

        if (!campoValor) return null;

        const correo = campoValor.split(';');
        correo.forEach((item: any) => {
          if (
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(item) ===
            false
          ) {
            formGroup.get(campo)?.setErrors({ pattern: true });
          }
        });
      });

      return null;
    };
  }
}
