import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubdominioService } from '@comun/services/subdominio.service';
import { getCookie } from 'typescript-cookie';
import { environment } from '@env/environment';

@Injectable()
export class EmpresaCookieInterceptor implements HttpInterceptor {
  constructor(private subdominioService: SubdominioService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const cookie = getCookie('empresa'); // Reemplaza 'nombre_de_tu_cookie' con el nombre de tu cookie
    if (this.subdominioService.esSubdominioActual()) {
      if (cookie) {
        let empresa = JSON.parse(cookie);

        if (this.subdominioService.subdominioNombre() !== empresa.subdominio) {
          //alert("Cambio la empresa ir")
          window.location.href = `${environment.dominioHttp}://${empresa.subdominio}${environment.dominioApp}/dashboard`;
        }
      }
    }

    return next.handle(request);
  }
}
