import { Pipe, PipeTransform } from '@angular/core';


/**
 * `SiNoPipe` es un Pipe personalizado en Angular que transforma un valor booleano en
 * una representación de texto, devolviendo `"SI"` para `true` y `"NO"` para `false`.
 *
 * ### Uso básico:
 *
 * En un template de Angular:
 * ```html
 * {{ someBooleanValue | siNo }}
 * ```
 *
 * Ejemplo:
 * ```html
 * <p>{{ true | siNo }}</p> <!-- Muestra: SI -->
 * <p>{{ false | siNo }}</p> <!-- Muestra: NO -->
 * ```
 */
@Pipe({
  name: 'siNo',
  standalone: true,
})
export class SiNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'SI' : 'NO';
  }
}
