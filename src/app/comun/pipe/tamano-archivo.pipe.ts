import { inject, Pipe, PipeTransform } from '@angular/core';
import { ArchivosUtilidadesService } from '@comun/services/archivos/archivos-utilidades.service';

@Pipe({
  name: 'tamanoArchivo',
  standalone: true,
})
export class TamanoArchivoPipe implements PipeTransform {
  private readonly _archivosUtilidadesService = inject(
    ArchivosUtilidadesService
  );

  constructor() {}

  /**
   * Convierte un tamaño en bytes a la unidad adecuada (Bytes, KB, MB, GB, etc.)
   * @param value Tamaño en bytes
   * @param decimals Número de decimales (por defecto 2)
   * @returns Tamaño formateado como string
   */
  transform(value: number, decimals: number = 2): string {
    return this._archivosUtilidadesService.formatFileSize(value, decimals);
  }
}
