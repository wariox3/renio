import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que verifica que dos fechas estén en el mismo año y que la fecha desde no sea mayor que la fecha hasta.
 * Ajusta las fechas sumando un día para corregir problemas de zona horaria.
 * @param fechaDesde Nombre del control que contiene la fecha desde
 * @param fechaHasta Nombre del control que contiene la fecha hasta
 * @returns Función validadora que devuelve errores si las fechas no cumplen las condiciones
 */
export function fechasDeMismoAnio(
  fechaDesde: string,
  fechaHasta: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const desde = formGroup.get(fechaDesde)?.value;
    const hasta = formGroup.get(fechaHasta)?.value;

    if (!desde || !hasta) {
      return null;
    }

    // Create date objects and add one day to fix timezone issues
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta);
    
    // Add one day to each date to fix timezone issues
    const desdeAjustado = new Date(desdeDate);
    desdeAjustado.setDate(desdeAjustado.getDate() + 1);
    
    const hastaAjustado = new Date(hastaDate);
    hastaAjustado.setDate(hastaAjustado.getDate() + 1);
    
    // Check if fecha_desde is greater than fecha_hasta
    if (desdeAjustado > hastaAjustado) {
      return { fechaInvalida: true };
    }
    
    // Check if both dates are in the same year
    if (desdeAjustado.getFullYear() !== hastaAjustado.getFullYear()) {
      return { diferenteAnio: true };
    }
    
    return null;
  };
}
