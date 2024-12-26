import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): ErrorInformacion;
}

export interface ErrorInformacion {
  statusCode: number;
  codigo?: number | null;
  mensaje: string;
}

export interface ErrorResponse {
  codigo: number | null;
  mensaje: string;
  validaciones: ErrorValidacionesCampo | null;
  validacion: ErrorValidacionesCampo | null;
}

export interface ErrorValidacionesCampo {
  [key: string]: string[];
}
