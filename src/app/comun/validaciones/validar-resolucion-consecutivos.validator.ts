import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para comparar consecutivos
export function validarConsecutivos(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const consecutivoDesde = formGroup.get('consecutivo_desde')?.value;
    const consecutivoHasta = formGroup.get('consecutivo_hasta')?.value;

    if (
      consecutivoDesde !== null &&
      consecutivoHasta !== null &&
      parseInt(consecutivoHasta) < parseInt(consecutivoDesde)
    ) {
      return { consecutivosInvalidos: true }; // Error personalizado
    }

    return null; // No hay errores
  };
}
