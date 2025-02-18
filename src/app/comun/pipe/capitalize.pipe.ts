import { Pipe, type PipeTransform } from '@angular/core';

/**
 * `CapitalizePipe` es un Pipe personalizado en Angular que transforma una cadena,
 * convirtiendo la primera letra en mayúscula y el resto en minúsculas.
 *
 * ### Uso básico:
 *
 * En un template de Angular:
 * ```html
 * <p>{{ 'ejemplo' | appCapitalizePipe }}</p> <!-- Muestra: "Ejemplo" -->
 * ```
 *
 * En un componente TypeScript:
 * ```typescript
 * constructor(private capitalizePipe: CapitalizePipe) {}
 * const resultado = this.capitalizePipe.transform('ejemplo');
 * console.log(resultado); // "Ejemplo"
 * ```
 */
@Pipe({
  name: 'appCapitalizePipe',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
