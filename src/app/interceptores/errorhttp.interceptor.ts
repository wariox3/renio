import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth';

export const errorHttpInterceptor: HttpInterceptorFn = (
  request,
  next: HttpHandlerFn
) => {
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
          case 400:
            errorCodigo = 400;
            errorMensaje =
              'Solicitud inválida. Verifica los datos y reintenta.';
            if (error.error.hasOwnProperty('mensaje')) {
              errorCodigo = error.error.codigo;
              errorMensaje = error.error.mensaje;
            }
            if (error.error.hasOwnProperty('validacion')) {
              for (const key in error.error.validacion) {
                if (error.error.validacion.hasOwnProperty(key)) {
                  const value = error.error.validacion[key];
                  errorMensaje += `<br/> ${key}: ${value} <br/>`;
                }
              }
            }
            if (error.error.hasOwnProperty('mensaje')) {
              errorCodigo = error.error.codigo;
              errorMensaje = error.error.mensaje;
            }
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
            break;
        }
      }
      return throwError(() => {
        if(!error.url?.includes('asset')){
          alertService.mensajeError(`Error ${errorCodigo}`, errorMensaje);
        }
        return error.error;
      });
    })
  );
};
