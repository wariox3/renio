import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { usuarioActionActualizarIdioma, usuarioActionActualizarInformacionUsuario, usuarioActionInit } from '@redux/actions/usuario.actions';
import { tap } from 'rxjs/operators';
import { getCookie, setCookie } from 'typescript-cookie';

@Injectable()
export class UsuarioEffects {
  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usuarioActionInit),
        tap((action) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          if(environment.production){
            setCookie('usuario', JSON.stringify(action.usuario), { expires: calcularTresHoras, path: '/', domain: '.muup.online' })
          }else {
            setCookie('usuario', JSON.stringify(action.usuario), { expires: calcularTresHoras, path: '/', })
          }
        })
      ),
    { dispatch: false }
  );

  updateCookie$ = createEffect(

    () => 
      this.actions$.pipe(
        ofType(usuarioActionActualizarInformacionUsuario),
        tap((action) => {
          let coockieUsuario = getCookie('usuario')
          if(coockieUsuario){
            let jsonUsuario = JSON.parse(coockieUsuario)
            jsonUsuario.nombre = action.nombre
            jsonUsuario.apellido = action.apellido
            jsonUsuario.telefono = action.telefono
            jsonUsuario.nombre_corto = action.nombre_corto
            jsonUsuario.idioma = action.idioma
            if(environment.production){
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/', domain: '.muup.online' })
            }else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/', })
            } 
          }
        })
      ),
      { dispatch: false } 
  ) 

  updateCookieIdioma$ = createEffect(

    () => 
      this.actions$.pipe(
        ofType(usuarioActionActualizarIdioma),
        tap((action) => {
          let coockieUsuario = getCookie('usuario')
          if(coockieUsuario){
            let jsonUsuario = JSON.parse(coockieUsuario)
            jsonUsuario.idioma = action.idioma
            if(environment.production){
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/', domain: '.muup.online' })
            }else {
              setCookie('usuario', JSON.stringify(jsonUsuario), { path: '/', })
            } 
          }
        })
      ),
      { dispatch: false } 
  ) 

  constructor(private actions$: Actions) {}
}
