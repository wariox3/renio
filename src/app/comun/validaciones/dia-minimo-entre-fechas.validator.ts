import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minimumDaysBetweenDates(days: number): ValidatorFn {
  return (control: AbstractControl) => {
    const fechaDesde = control.get('fecha_desde')?.value;
    const fechaHasta = control.get('fecha_hasta')?.value;

    if (!fechaDesde || !fechaHasta) {
      return null;  // Si alguna fecha está vacía, no hacemos la validación
    }

    // Convertimos los valores a fechas nativas de JavaScript
    const fromDate = new Date(fechaDesde);
    const toDate = new Date(fechaHasta);

    // Calculamos la diferencia en milisegundos y luego la convertimos a días
    const diffInMs = toDate.getTime() - fromDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Si la diferencia en días es menor al mínimo requerido, retorna un error
    return diffInDays === days-1 ? null : { minimoDias: true };
  };
}
