import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { map, tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

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

  constructor(private actions$: Actions) {}
}
