import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import {
  AdicionarGuiaDto,
  GenDocumentoGuia,
} from '../interfaces/documento-dto.interface';

/**
 * Repositorio para operaciones CRUD de guías asociadas a documentos
 * Maneja la relación entre documentos y guías de transporte
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentoGuiaRepository {
  private readonly _httpService = inject(HttpService);
  private readonly _generalService = inject(GeneralService);

  /**
   * Lista guías asociadas a un documento
   * @param documentoId ID del documento
   */
  listarPorDocumento(documentoId: number): Observable<RespuestaApi<GenDocumentoGuia>> {
    return this._generalService.consultaApi<RespuestaApi<GenDocumentoGuia>>(
      'general/documento_guia/',
      { documento_id: documentoId }
    );
  }

  /**
   * Adiciona una guía a un documento
   * @param data Datos de la guía a adicionar
   */
  adicionarGuia(data: AdicionarGuiaDto): Observable<GenDocumentoGuia> {
    return this._httpService.post<GenDocumentoGuia>(
      'general/documento_guia/adicionar-guia/',
      data
    );
  }

  /**
   * Elimina una guía de un documento
   * @param id ID de la relación documento-guía
   */
  eliminar(id: number): Observable<any> {
    return this._httpService.post(
      'general/documento_guia/eliminar/',
      { id }
    );
  }
}

