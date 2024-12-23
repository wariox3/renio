import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado parametrizable para un solo campo
export function validarNoIniciaCon(caracter: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (valor && valor.startsWith(caracter)) {
      return { primerCaracterInvalido: true }; // Error personalizado
    }
    return null; // Sin errores
  };
}
