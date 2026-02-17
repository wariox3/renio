import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AlertaService } from '@comun/services/alerta.service';
import { DocumentoRepository } from '../repositories/documento.repository';
import { GenDocumento } from '../interfaces/gen-documento.interface';
import {
  ActualizarDocumentoDto,
  CrearDocumentoDto,
  DocumentoAnuladoResponse,
  DocumentoAprobadoResponse,
  DocumentoEmitidoResponse,
  DocumentoFiltrosDto,
} from '../interfaces/documento-dto.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { DocumentoValidator } from '../utils/documento-validator.util';

/**
 * Servicio de dominio para operaciones de documentos
 * Orquesta lógica de negocio usando DocumentoValidator para validaciones
 *
 * Este servicio centraliza toda la lógica de documentos (facturas venta/compra,
 * notas crédito/débito, documentos soporte, etc.)
 *
 * Responsabilidades:
 * - Orquestar llamadas al repository
 * - Validar usando DocumentoValidator
 * - Mostrar mensajes de alerta al usuario
 * - Manejo de errores
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly _documentoRepository = inject(DocumentoRepository);
  private readonly _alertaService = inject(AlertaService);

  /**
   * Guarda un nuevo documento con validaciones de negocio
   * @param data Datos del documento a crear
   */
  guardar(data: CrearDocumentoDto): Observable<{ documento: GenDocumento }> {
    // Usar el validador para verificar que el documento esté completo
    const validacion = DocumentoValidator.validarDocumentoCompleto(data as any);

    if (!validacion.valido) {
      this._alertaService.mensajeError('Error', validacion.mensaje!);
      return throwError(() => new Error(validacion.mensaje));
    }

    return this._documentoRepository.guardar(data).pipe(
      tap((response) => {
        this._alertaService.mensajaExitoso(
          `Documento ${response.documento.numero} guardado correctamente`
        );
      }),
      catchError((error) => {
        this._alertaService.mensajeError(
          'Error',
          'No se pudo guardar el documento'
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un documento existente
   * @param data Datos del documento a actualizar
   */
  actualizar(data: ActualizarDocumentoDto): Observable<{ documento: GenDocumento }> {
    if (!data.id) {
      this._alertaService.mensajeError(
        'Error',
        'ID de documento requerido para actualizar'
      );
      return throwError(() => new Error('ID requerido'));
    }

    return this._documentoRepository.actualizar(data).pipe(
      tap((response) => {
        this._alertaService.mensajaExitoso(
          `Documento ${response.documento.numero} actualizado correctamente`
        );
      }),
      catchError((error) => {
        this._alertaService.mensajeError(
          'Error',
          'No se pudo actualizar el documento'
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Aprueba un documento validando su estado
   * @param documentoId ID del documento a aprobar
   */
  aprobar(documentoId: number): Observable<DocumentoAprobadoResponse> {
    return this._documentoRepository.detalle(documentoId).pipe(
      switchMap(({ documento }) => {
        // Usar el validador para verificar si puede aprobar
        const validacion = DocumentoValidator.puedeAprobar(documento);

        if (!validacion.valido) {
          this._alertaService.mensajeError('Error', validacion.mensaje!);
          return throwError(() => new Error(validacion.mensaje));
        }

        return this._documentoRepository.aprobar(documentoId);
      }),
      tap(() => {
        this._alertaService.mensajaExitoso('Documento aprobado exitosamente');
      }),
      catchError((error) => {
        // Solo mostrar error si no fue por validación
        if (!error.message?.includes('ya aprobado') && !error.message?.includes('anulado')) {
          this._alertaService.mensajeError(
            'Error',
            'No se pudo aprobar el documento'
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Emite un documento electrónico a la DIAN
   * @param documentoId ID del documento a emitir
   */
  emitir(documentoId: number): Observable<DocumentoEmitidoResponse> {
    return this._documentoRepository.detalle(documentoId).pipe(
      switchMap(({ documento }) => {
        // Usar el validador para verificar si puede emitir
        const validacion = DocumentoValidator.puedeEmitir(documento);

        if (!validacion.valido) {
          this._alertaService.mensajeError('Error', validacion.mensaje!);
          return throwError(() => new Error(validacion.mensaje));
        }

        return this._documentoRepository.emitir(documentoId);
      }),
      tap(() => {
        this._alertaService.mensajaExitoso('Documento emitido electrónicamente');
      }),
      catchError((error) => {
        // Solo mostrar error si no fue por validación
        if (!error.message?.includes('ya emitido') && !error.message?.includes('anulado')) {
          this._alertaService.mensajeError(
            'Error',
            'No se pudo emitir el documento'
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Anula un documento validando su estado
   * @param documentoId ID del documento a anular
   */
  anular(documentoId: number): Observable<DocumentoAnuladoResponse> {
    return this._documentoRepository.detalle(documentoId).pipe(
      switchMap(({ documento }) => {
        // Usar el validador para verificar si puede anular
        const validacion = DocumentoValidator.puedeAnular(documento);

        if (!validacion.valido) {
          this._alertaService.mensajeError('Error', validacion.mensaje!);
          return throwError(() => new Error(validacion.mensaje));
        }

        return this._documentoRepository.anular(documentoId);
      }),
      tap(() => {
        this._alertaService.mensajaExitoso('Documento anulado exitosamente');
      }),
      catchError((error) => {
        // Solo mostrar error si no fue por validación
        if (!error.message?.includes('ya anulado') && !error.message?.includes('contabilizado')) {
          this._alertaService.mensajeError(
            'Error',
            'No se pudo anular el documento'
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el detalle de un documento
   * @param documentoId ID del documento
   */
  obtenerDetalle(documentoId: number): Observable<GenDocumento> {
    return this._documentoRepository.detalle(documentoId).pipe(
      map((response) => response.documento),
      catchError((error) => {
        this._alertaService.mensajeError(
          'Error',
          'No se pudo obtener el documento'
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Lista documentos con filtros
   * @param filtros Criterios de búsqueda
   */
  listar(filtros: DocumentoFiltrosDto = {}): Observable<RespuestaApi<GenDocumento>> {
    return this._documentoRepository.listar(filtros);
  }

  /**
   * Elimina un documento (solo si no está aprobado)
   * @param documentoId ID del documento a eliminar
   */
  eliminar(documentoId: number): Observable<any> {
    return this._documentoRepository.detalle(documentoId).pipe(
      switchMap(({ documento }) => {
        // Usar el validador para verificar si puede eliminar
        const validacion = DocumentoValidator.puedeEliminar(documento);

        if (!validacion.valido) {
          this._alertaService.mensajeError('Error', validacion.mensaje!);
          return throwError(() => new Error(validacion.mensaje));
        }

        return this._documentoRepository.eliminar(documentoId);
      }),
      tap(() => {
        this._alertaService.mensajaExitoso('Documento eliminado exitosamente');
      }),
      catchError((error) => {
        // Solo mostrar error si no fue por validación
        if (!error.message?.includes('aprobado') && !error.message?.includes('electrónico')) {
          this._alertaService.mensajeError(
            'Error',
            'No se pudo eliminar el documento'
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Descarta un documento electrónico
   * @param documentoId ID del documento a descartar
   */
  descartarDocumento(documentoId: number): Observable<{ documento: GenDocumento }> {
    return this._documentoRepository.descartarDocumento(documentoId).pipe(
      tap(() => {
        this._alertaService.mensajaExitoso(
          'Documento electrónico descartado'
        );
      }),
      catchError((error) => {
        this._alertaService.mensajeError(
          'Error',
          'No se pudo descartar el documento'
        );
        return throwError(() => error);
      })
    );
  }
}
