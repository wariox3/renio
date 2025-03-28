import { inject, Injectable } from '@angular/core';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _cookieService = inject(CookieService);

  constructor() {}

  guardarToken(token: string, tiempo: Date) {
    this._cookieService.set(cookieKey.ACCESS_TOKEN, token, {
      expires: tiempo,
      path: '/',
    });
  }

  obtenerToken() {
    const token = this._cookieService.get(cookieKey.ACCESS_TOKEN);
    return token;
  }

  eliminarToken() {
    this._cookieService.delete(cookieKey.ACCESS_TOKEN, '/');
  }

  guardarRefreshToken(refreshToken: string, tiempo: Date) {
    this._cookieService.set(cookieKey.REFRESH_TOKEN, refreshToken, {
      expires: tiempo,
      path: '/',
    });
  }

  obtenerRefreshToken() {
    const refreshToken = this._cookieService.get(cookieKey.REFRESH_TOKEN);
    return refreshToken;
  }

  eliminarRefreshToken() {
    this._cookieService.delete(cookieKey.REFRESH_TOKEN, '/');
  }

  validarToken() {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado = jwt_decode<JwtPayload>(token);
    if (tokenDecodificado && tokenDecodificado?.exp) {
      const tokenFecha = new Date(0);
      const fechaActual = new Date();
      tokenFecha.setUTCSeconds(tokenDecodificado.exp);

      return tokenFecha.getTime() > fechaActual.getTime();
    }
    return false;
  }

  validarRefreshToken() {
    const token = this.obtenerRefreshToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado = jwt_decode<JwtPayload>(token);
    if (tokenDecodificado && tokenDecodificado?.exp) {
      const tokenFecha = new Date(0);
      const fechaActual = new Date();
      tokenFecha.setUTCSeconds(tokenDecodificado.exp);

      return tokenFecha.getTime() > fechaActual.getTime();
    }
    return false;
  }
}
