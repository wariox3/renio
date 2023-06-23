import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  guardarToken(token: string, calcularTresHoras: Date) {
    //para calcular las 3 horas la formula es fechaActual * horas * minutos * segundos * milisegundos
    if(environment.production){
      setCookie('token', token, { expires: calcularTresHoras, path: '/', domain: '.muup.online' })
    }else {
      setCookie('token', token, { expires: calcularTresHoras, path: '/'})
    }
  }

  obtenerToken() {
    const token = getCookie('token')
    return token;
  }

  eliminarToken(){
    removeCookie('token',  {path: '/', domain:  '.muup.online' })
    removeCookie('token',  {path: '/'})
  }

  guardarRefreshToken(RefreshToken: string, calcularTresHoras: Date) {
    if(environment.production){
      setCookie('RefreshToken', RefreshToken, { expires: calcularTresHoras, path: '/', domain: '.muup.online' })
    }else {
      setCookie('RefreshToken', RefreshToken, { expires: calcularTresHoras, path: '/'})
    }
  }

  obtenerRefreshToken() {
    const refreshToken = getCookie('RefreshToken')
    return refreshToken;
  }

  eliminarRefreshToken(){
    removeCookie('RefreshToken',  {path: '/',  domain: '.muup.online'})
    removeCookie('RefreshToken',  {path: '/'})

  }

  validarToken(){
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado =  jwt_decode<JwtPayload>(token);
    if(tokenDecodificado && tokenDecodificado?.exp){
      const tokenFecha = new Date(0)
      const fechaActual = new Date()
      tokenFecha.setUTCSeconds(tokenDecodificado.exp)

      return tokenFecha.getTime() > fechaActual.getTime()
    }
    return false
  }


  validarRefreshToken(){
    const token = this.obtenerRefreshToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado =  jwt_decode<JwtPayload>(token);
    if(tokenDecodificado && tokenDecodificado?.exp){
      const tokenFecha = new Date(0)
      const fechaActual = new Date()
      tokenFecha.setUTCSeconds(tokenDecodificado.exp)

      return tokenFecha.getTime() > fechaActual.getTime()
    }
    return false

  }
}
