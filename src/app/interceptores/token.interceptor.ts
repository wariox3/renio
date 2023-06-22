import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from '../modules/auth/services/token.service';
import { AuthService } from '../modules/auth/services/auth.service';

const requiereToken = new HttpContextToken<boolean>(() => true);

export function chackRequiereToken() {
  return new HttpContext().set(requiereToken, false);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private loginService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(requiereToken)) {
      //validar vigencia
      const tokenValido  = this.tokenService.validarToken();
      if (tokenValido) {
        return this.adicionarToken(request, next);
      } else {
        return this.actualizarTokenPorVencimiento(request, next);
      }
    }
    return next.handle(request);
  }

  private adicionarToken(request: HttpRequest<unknown>, next: HttpHandler) {
    if (request.context.get(requiereToken)) {
      const token = this.tokenService.obtenerToken();
      if (token) {
        const authReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(authReq);
      }
    }
    return next.handle(request);
  }

  private actualizarTokenPorVencimiento(request: HttpRequest<unknown>,  next: HttpHandler) {
    const refreshToken = this.tokenService.obtenerRefreshToken();
    const validarRefreshToken = this.tokenService.validarRefreshToken()
    if (refreshToken && validarRefreshToken) {
      this.loginService
        .refreshToken(refreshToken)
        .pipe(switchMap(async () => this.adicionarToken(request, next)));
    }
    return next.handle(request);
  }
}
