import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { GenDocumentoDetalle } from '../interfaces/gen-documento-detalle.interface';
import {
  ActualizarDocumentoDetalleDto,
  CrearDocumentoDetalleDto,
  DocumentoDetalleFiltrosDto,
} from '../interfaces/documento-dto.interface';

/**
 * Repositorio para operaciones CRUD de detalles de documentos
 * Maneja las líneas/items individuales dentro de un documento
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentoDetalleRepository {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);

  /**
   * Lista detalles de documentos con filtros opcionales
   * @param filtros Criterios de búsqueda
   */
  listar(
    filtros: DocumentoDetalleFiltrosDto = {}
  ): Observable<RespuestaApi<GenDocumentoDetalle>> {
    return this._generalService.consultaApi<RespuestaApi<GenDocumentoDetalle>>(
      'general/documento_detalle/',
      filtros
    );
  }

  /**
   * Obtiene un detalle específico por ID
   * @param id ID del detalle
   */
  detalle(id: number): Observable<GenDocumentoDetalle> {
    return this._httpService.getDetalle<GenDocumentoDetalle>(
      `general/documento_detalle/${id}/`
    );
  }

  /**
   * Crea un nuevo detalle de documento
   * @param data Datos del detalle a crear
   */
  crear(data: CrearDocumentoDetalleDto): Observable<GenDocumentoDetalle> {
    return this._httpService.post<GenDocumentoDetalle>(
      'general/documento_detalle/',
      data
    );
  }

  /**
   * Actualiza un detalle de documento existente
   * @param id ID del detalle
   * @param data Datos a actualizar
   */
  actualizar(
    id: number,
    data: Partial<GenDocumentoDetalle>
  ): Observable<GenDocumentoDetalle> {
    return this._httpService.patch<GenDocumentoDetalle>(
      `general/documento_detalle/${id}/`,
      data
    );
  }

  /**
   * Elimina un detalle de documento
   * @param id ID del detalle a eliminar
   */
  eliminar(id: number): Observable<any> {
    return this._httpService.delete(
      `general/documento_detalle/${id}/`,
      {}
    );
  }
}

