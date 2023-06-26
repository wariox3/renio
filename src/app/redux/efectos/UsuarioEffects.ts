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
          if(environment.production){
            setCookie('usuario', JSON.stringify(action.usuario), { path: '/', domain: '.muup.online' })
          }else {
            setCookie('usuario', JSON.stringify(action.usuario), { path: '/'})
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
