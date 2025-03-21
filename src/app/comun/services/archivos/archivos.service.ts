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
      archivo_tipo_id: 1,
    });
  }

  cargarArchivoImagen(payload: {
    modelo: string | null;
    codigo: number | null;
    nombreArchivo: string;
    archivoBase64: string;
    archivoTipoId: number;
    documentoId: number | null;
  }) {
    return this._httpService.post('general/archivo/cargar/', {
      modelo: payload.modelo,
      codigo: payload.codigo,
      nombre_archivo: payload.nombreArchivo,
      archivo_base64: payload.archivoBase64,
      archivo_tipo_id: payload.archivoTipoId,
      documento_id: payload.documentoId,
    });
  }

  descargarArchivoGeneral(payload: { id: number }) {
    return this._httpService.descargarArchivo(
      'general/archivo/descargar/',
      payload,
    );
  }

  eliminarArchivoGeneral(payload: { id: number }) {
    return this._httpService.delete(`general/archivo/${payload.id}/`, payload);
  }
}
