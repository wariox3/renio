import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appPrecioFormatPipe',
  standalone: true,
})
export class PrecioFormatPipe implements PipeTransform {

  transform(value: number): string {
    // Formatea el valor numérico con separador de miles y separador decimal personalizado
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

}
