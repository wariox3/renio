import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@comun/services/http.service';
import { GeneralService } from '@comun/services/general.service';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { GenDocumento, GenerarMasivoPayload } from '../interfaces/gen-documento.interface';
import {
  ActualizarDocumentoDto,
  CargarCierreDto,
  CargarCierreResponse,
  CrearDocumentoDto,
  DocumentoAnuladoResponse,
  DocumentoAprobadoResponse,
  DocumentoEmitidoResponse,
  DocumentoFiltrosDto,
  GenerarMasivoResponse,
} from '../interfaces/documento-dto.interface';

/**
 * Repositorio para operaciones CRUD de documentos
 * Maneja comunicación HTTP con el backend para todos los tipos de documentos
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentoRepository {
  private readonly _httpService = inject(HttpService);
  private readonly _generalService = inject(GeneralService);

  /**
   * Aprueba un documento
   * @param documentoId ID del documento a aprobar
   */
  aprobar(documentoId: number): Observable<DocumentoAprobadoResponse> {
    return this._httpService.post<DocumentoAprobadoResponse>(
      'general/documento/aprobar/',
      documentoId
    );
  }

  /**
   * Emite un documento electrónico a la DIAN
   * @param documentoId ID del documento a emitir
   */
  emitir(documentoId: number): Observable<DocumentoEmitidoResponse> {
    return this._httpService.post<DocumentoEmitidoResponse>(
      'general/documento/emitir/',
      { documento_id: documentoId }
    );
  }

  /**
   * Guarda un nuevo documento
   * @param data Datos del documento a crear
   */
  guardar(data: CrearDocumentoDto): Observable<{ documento: GenDocumento }> {
    return this._httpService.post<{ documento: GenDocumento }>(
      'general/documento/nuevo/',
      data
    );
  }

  /**
   * Actualiza un documento existente (POST /actualizar/)
   * @param data Datos del documento a actualizar (debe incluir id)
   */
  actualizar(data: ActualizarDocumentoDto): Observable<{ documento: GenDocumento }> {
    return this._httpService.post<{ documento: GenDocumento }>(
      'general/documento/actualizar/',
      data
    );
  }

  /**
   * Actualiza parcialmente un documento (PATCH /{id}/)
   * @param id ID del documento
   * @param data Campos a actualizar
   */
  actualizarParcial(
    id: number,
    data: Partial<GenDocumento>
  ): Observable<GenDocumento> {
    return this._httpService.patch<GenDocumento>(
      `general/documento/${id}/`,
      data
    );
  }

  /**
   * Obtiene el detalle completo de un documento
   * @param id ID del documento
   */
  detalle(id: number): Observable<{ documento: GenDocumento }> {
    return this._httpService.getDetalle<{ documento: GenDocumento }>(
      `general/documento/${id}/detalle/`
    );
  }

  /**
   * Lista documentos con filtros opcionales
   * @param filtros Criterios de búsqueda
   */
  listar(filtros: DocumentoFiltrosDto = {}): Observable<RespuestaApi<GenDocumento>> {
    return this._generalService.consultaApi<RespuestaApi<GenDocumento>>(
      'general/documento/',
      filtros
    );
  }

  /**
   * Elimina un documento
   * @param id ID del documento a eliminar
   */
  eliminar(id: number): Observable<any> {
    return this._httpService.delete(`general/documento/${id}/`, {});
  }

  /**
   * Anula un documento
   * @param documentoId ID del documento a anular
   */
  anular(documentoId: number): Observable<DocumentoAnuladoResponse> {
    return this._httpService.post<DocumentoAnuladoResponse>(
      'general/documento/anular/',
      { id: documentoId }
    );
  }

  /**
   * Descarta un documento electrónico
   * @param id ID del documento a descartar
   */
  descartarDocumento(id: number): Observable<{ documento: GenDocumento }> {
    return this._httpService.post<{ documento: GenDocumento }>(
      'general/documento/electronico_descartar/',
      { id }
    );
  }

  /**
   * Genera documentos de forma masiva
   * @param payload Configuración de generación masiva
   */
  generarMasivo(payload: GenerarMasivoPayload): Observable<GenerarMasivoResponse> {
    return this._httpService.post<GenerarMasivoResponse>(
      'general/documento/generar-masivo/',
      payload
    );
  }

  /**
   * Carga cierre de documentos desde archivo
   * @param data Datos del cierre a cargar
   */
  cargarCierre(data: CargarCierreDto): Observable<CargarCierreResponse> {
    return this._httpService.post<CargarCierreResponse>(
      'general/documento/cargar-cierre/',
      data
    );
  }
}

