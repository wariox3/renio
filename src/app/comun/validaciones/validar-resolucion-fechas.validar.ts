import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para comparar fechas
export function validarFechas(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fechaDesde = formGroup.get('fecha_desde')?.value;
    const fechaHasta = formGroup.get('fecha_hasta')?.value;

    if (fechaDesde && fechaHasta && new Date(fechaHasta) < new Date(fechaDesde)) {
      return { fechasInvalidas: true }; // Error personalizado
    }

    return null; // No hay errores
  };
}
