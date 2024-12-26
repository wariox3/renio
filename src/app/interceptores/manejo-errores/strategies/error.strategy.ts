import { HttpErrorResponse } from '@angular/common/http';
import {
  ErrorHandlerStrategy,
  ErrorInformacion,
} from '../http-error.interface';

export class UnauthorizedStrategy implements ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): ErrorInformacion {
    return {
      statusCode: 401,
      mensaje: 'No autorizado. Redirigiendo al inicio de sesión...',
    };
  }
}

export class NotFoundStrategy implements ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): ErrorInformacion {
    return {
      statusCode: 404,
      mensaje: 'El recurso solicitado no se encontró.',
    };
  }
}

export class MethodNotAllowedStrategy implements ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): ErrorInformacion {
    return {
      statusCode: 405,
      mensaje: 'Servidor fuera de línea, intente más tarde.',
    };
  }
}

export class InternalServerErrorStrategy implements ErrorHandlerStrategy {
  handle(error: HttpErrorResponse): ErrorInformacion {
    return {
      statusCode: 500,
      mensaje: 'Error interno del servidor. Por favor, intente más tarde.',
    };
  }
}
