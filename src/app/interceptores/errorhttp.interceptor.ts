import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AlertaService } from '@comun/services/alerta.service';


@Injectable()
export class ErrorhttpInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertaService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler){
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse)=>{
          let errorMessage: string;
          console.log(error);

          if (error.error instanceof ErrorEvent) {
            // Error de cliente
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Error del servidor
            switch (error.status) {
              case 404:
                errorMessage = 'El recurso solicitado no se encontró.';
                break;
              case 500:
                errorMessage = 'Se produjo un error interno en el servidor.';
                break;
              // Agrega más casos según tus necesidades
              default:
                errorMessage = `Código de error: ${error.error.error}`;

                break;
            }
          }

          return throwError(() => this.alertService.mensajeError("Error:", errorMessage));
        })
      );
  }
}
