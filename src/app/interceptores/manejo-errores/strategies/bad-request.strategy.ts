import { HttpErrorResponse } from '@angular/common/http';
import {
  ErrorHandlerStrategy,
  ErrorInformacion,
  ErrorResponse,
  ErrorValidacionesCampo,
} from '../http-error.interface';

export class BadRequestStrategy implements ErrorHandlerStrategy {
  handle(errorResponse: HttpErrorResponse): ErrorInformacion {
    const { error } = errorResponse;
    let mensaje =
      error?.mensaje || 'Solicitud inválida. Verifica los datos y reintenta.';
    mensaje += this._generarListadoErrores(error);

    return { statusCode: 400, codigo: error.codigo, mensaje };
  }

  /**
   * Procesa validaciones anidadas en el objeto de error y genera un mensaje HTML con los errores.
   *
   * @param error - Objeto de error que puede contener validaciones específicas.
   * @returns {string} Un string con el listado de validaciones en formato HTML.
   */
  private _generarListadoErrores(error: ErrorResponse): string {
    if (error.hasOwnProperty('validacion')) {
      const validacionesProcesadas = this._formatearErroresPorCampo(
        error.validacion
      );

      return validacionesProcesadas;
    }

    if (error.hasOwnProperty('validaciones')) {
      const validacionesProcesadas = this._formatearErroresPorCampo(
        error.validaciones
      );

      return validacionesProcesadas;
    }

    return '';
  }

  /**
   * Procesa las validaciones específicas dentro del campo de un objeto de error.
   *
   * @param validaciones - Objeto de errores que contiene provienen del error.
   * @returns {string} Un string en formato HTML con los errores procesados.
   */
  private _formatearErroresPorCampo(
    validaciones: ErrorValidacionesCampo | null
  ) {
    if (!Object.keys(validaciones || {})) {
      return '';
    }

    const errorList = Object.entries(validaciones || {})
      .map(([campo, mensaje]: any[]) => {
        const mensajeProcesado = mensaje
          ?.map((m: string) => `<li>${m}</li>`)
          .join('');
        return `<div> ${campo}: <ul>${mensajeProcesado}</ul> </div> `;
      })
      .join('');

    const errorTemplate = `<div>${errorList}</div>`;

    return errorTemplate;
  }
}
