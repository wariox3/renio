import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { map, tap } from 'rxjs/operators';
import { setCookie } from 'typescript-cookie';

@Injectable()
export class EmpresaEffects {
  guardarEmpresa$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(empresaActionInit),
        tap((action) => {
          if(environment.production){
            setCookie('empresa', JSON.stringify(action.empresa), { path: '/', domain: '.muup.online' })
          }else {
            setCookie('empresa', JSON.stringify(action.empresa), { path: '/'})
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
