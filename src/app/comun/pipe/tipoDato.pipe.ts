import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTipoDato',
  standalone: true,
})
export class TipoDatoPipe implements PipeTransform {
  transform(campo: any) {
    // Verifica si se proporciona un campo
    if (campo) {
      // Switch para manejar diferentes tipos de campo
      switch (campo.type) {
        case 'number':
          if (campo.aplicaFormatoNumerico) {
            // Formatea el valor con dos decimales y comas para separar miles
            let formattedValue = campo.valor
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return `${formattedValue}`;
          }
          return campo.valor;
        // Si el campo es de tipo booleano
        case 'Booleano':
          return campo.valor ? 'SI' : 'NO';
        case 'Porcentaje':
          if (typeof campo.valor === 'string') {
            return `${parseFloat(campo.valor.replace(',', '.'))}`;
          } else if (campo.valor !== null && campo.valor !== undefined) {
            // Convierte `valor` a cadena si no es null o undefined
            return `${parseFloat(String(campo.valor).replace(',', '.'))}`;
          } else {
            return '0'; // O algún valor predeterminado adecuado
          }
        default:
          return campo.valor;
      }
    }
  }
}
