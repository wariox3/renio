import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth';

export const errorHttpInterceptor: HttpInterceptorFn = (request,   next: HttpHandlerFn) => {
  const alertService = inject(AlertaService);
  const auth = inject(AuthService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorCodigo: number;
      let errorMensaje: string = '';

      if (error.error instanceof ErrorEvent) {
        // Error de cliente
        errorMensaje = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 401:
            auth.logout();
            break;
          case 404:
            errorCodigo = 404;
            errorMensaje = 'El recurso solicitado no se encontró.';
            break;
          case 405:
            errorCodigo = 405;
            errorMensaje = 'Servidor fuera de línea, intente más tarde.';
            break;
          case 500:
            errorCodigo = 500;
            errorMensaje = 'Se produjo un error interno en el servidor.';
            break;
          case 0:
            errorCodigo = 502;
            errorMensaje =
              'Estamos experimentando dificultades temporales en el servidor. Por favor, reintente acceder más tarde.';
            break;
          default:
            let objError = error.error;
            if (objError.hasOwnProperty('error')) {
              errorCodigo = objError.codigo;
              errorMensaje = objError.error;
            }
            if (objError.hasOwnProperty('mensaje')) {
              errorCodigo = objError.codigo;
              errorMensaje = objError.mensaje;
            }
            if (objError.hasOwnProperty('validaciones')) {
              for (const key in objError.validaciones) {
                if (objError.validaciones.hasOwnProperty(key)) {
                  const value = objError.validaciones[key];
                  errorMensaje += `<br/> ${key}: ${value} <br/>`;
                }
              }
            }
            break;
        }
      }

      return throwError(() => (
        alertService.cerrarMensajes(),
        alertService.mensajeError(`Error ${errorCodigo}`, errorMensaje)
      ));
    })
  );
};
