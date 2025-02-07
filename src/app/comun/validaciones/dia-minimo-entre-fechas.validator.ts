import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minimumDaysBetweenDates(days: number): ValidatorFn {
  return (control: AbstractControl) => {
    const fechaDesde = control.get('fecha_desde')?.value;
    const fechaHasta = control.get('fecha_hasta')?.value;

    let minDaysRequired = days

    if (esFebrero(fechaDesde)) {
      minDaysRequired = casoEspecialFebrero(fechaDesde, minDaysRequired);
    }

    if (!fechaDesde || !fechaHasta) {
      return null; // Si alguna fecha está vacía, no hacemos la validación
    }

    // Convertimos los valores a fechas nativas de JavaScript
    const fromDate = new Date(fechaDesde);
    const toDate = new Date(fechaHasta);

    // Calculamos la diferencia en milisegundos y luego la convertimos a días
    const diffInMs = toDate.getTime() - fromDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Si la diferencia en días es menor al mínimo requerido, retorna un error
    return diffInDays === minDaysRequired - 1 ? null : { minimoDias: true };
  };
}

function casoEspecialFebrero(fecha: string, days: number): number {
  const [yearDesde, monthDesde, dayDesde] = fecha.split('-').map(Number);
  const ultimoDia = new Date(yearDesde, monthDesde, 0);
  const diferenciaDias = ultimoDia.getDate() - dayDesde;

  // si el periodo es mayor a el ultimo dia del mes, entonces devuelve el ultimo dia del mes
  if (days > ultimoDia.getDate()) {
    return ultimoDia.getDate();
  }

  // ejemplo: validacion del 1 al 15
  if (diferenciaDias > days) {
    return days;
  } else {
    return diferenciaDias + 1;
  }
}

function esFebrero(fecha: string): boolean {
  const [yearDesde, monthDesde, dayDesde] = fecha.split('-').map(Number);
  const fechaDesdeObj = new Date(yearDesde, monthDesde - 1, dayDesde);

  return fechaDesdeObj.getMonth() === 1; // getMonth() devuelve 1 para febrero (meses van de 0 a 11)
}
