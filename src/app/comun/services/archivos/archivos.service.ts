import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  private readonly _httpService = inject(HttpService);

  cargarArchivoGeneral(payload: {
    documentoId: number;
    nombreArchivo: string;
    archivoBase64: string;
  }) {
    return this._httpService.post('general/archivo/cargar/', {
      documento_id: payload.documentoId,
      nombre_archivo: payload.nombreArchivo,
      archivo_base64: payload.archivoBase64,
    });
  }

  descargarArchivoGeneral(payload: { id: number }) {
    return this._httpService.descargarArchivo(
      'general/archivo/descargar/',
      payload
    );
  }

  eliminarArchivoGeneral(payload: { id: number }) {
    return this._httpService.delete(
      `general/archivo/${payload.id}/`,
      payload
    );
  }
}
