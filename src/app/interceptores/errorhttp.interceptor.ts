import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AlertaService } from '@comun/services/alerta.service';

@Injectable()
export class ErrorhttpInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertaService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorCodigo: Number;
        let errorMensaje: string = "";

        if (error.error instanceof ErrorEvent) {
          // Error de cliente
          errorMensaje = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          switch (error.status) {
            case 404:
              errorCodigo = 404;
              errorMensaje = 'El recurso solicitado no se encontró.';
              break;
            case 500:
              errorCodigo = 500;
              errorMensaje = 'Se produjo un error interno en el servidor.';
              break;
            // Agrega más casos según tus necesidades
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

        return throwError(() =>
          this.alertService.mensajeError(`Error ${errorCodigo}`, errorMensaje)
        );
      })
    );
  }
}
