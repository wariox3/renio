import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para verificar el orden cronológico de fechas y asignar error al campo "hasta"
export function validarRangoDeFechas(campoDesde: string, campoHasta: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fechaDesdeControl = formGroup.get(campoDesde);
    const fechaHastaControl = formGroup.get(campoHasta);

    if (!fechaDesdeControl || !fechaHastaControl) return null;

    const fechaDesde = fechaDesdeControl.value;
    const fechaHasta = fechaHastaControl.value;

    if (fechaDesde && fechaHasta && new Date(fechaHasta) < new Date(fechaDesde)) {
      fechaHastaControl.setErrors({ rangoFechasInvalido: true }); // Marca error en "hasta"
    } else {
      // Si no hay error, limpiamos los errores previos
      if (fechaHastaControl.errors?.rangoFechasInvalido) {
        delete fechaHastaControl.errors.rangoFechasInvalido;
        fechaHastaControl.updateValueAndValidity({ onlySelf: true });
      }
    }

    return null; // No retornamos error al grupo
  };
}



// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// // Validador personalizado genérico para verificar el rango de fechas
// export function validarRangoDeFechas(campoDesde: string, campoHasta: string): ValidatorFn {
//   return (formGroup: AbstractControl): ValidationErrors | null => {
//     const fechaDesde = formGroup.get(campoDesde)?.value;
//     const fechaHasta = formGroup.get(campoHasta)?.value;

//     if (fechaDesde && fechaHasta && new Date(fechaHasta) < new Date(fechaDesde)) {
//       return { rangoFechasInvalido: true }; // Error personalizado
//     }

//     return null; // No hay errores
//   };
// }
