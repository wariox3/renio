import { inject, Injectable } from '@angular/core';
import { informacionMenuItem } from '@interfaces/menu/menu';
import { Store } from '@ngrx/store';
import { obtenerMenuInformacion, obtenerMenuSeleccion } from '@redux/selectors/menu.selectors';
import { map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuReducerService {
  private _store = inject(Store);

  constructor() {}

  public getMenuSeleccionado() {
    return this._store.select(obtenerMenuSeleccion)
  }

  public getModuloItemInformacion(modulo: string, alias: string) {
    return this._store.select(obtenerMenuInformacion).pipe(
      switchMap((menuInformacion) => {
        const moduloInformacion = this._getModulo(modulo, menuInformacion);
        return of(moduloInformacion);
      }),
      switchMap((moduloInformacion) => {
        const categoriaInformacion = this._getCategoria(
          moduloInformacion?.children,
          alias
        );

        return of(categoriaInformacion);
      })
    );
  }

  private _getModulo(modulo: string, menuInformacion: informacionMenuItem[]) {
    return menuInformacion.find((menu) => menu.nombre === modulo);
  }

  private _getCategoria(
    moduloInformacion: informacionMenuItem[] | undefined,
    alias: string
  ) {
    let categoriaItem: informacionMenuItem | undefined;

    if (!moduloInformacion) {
      return null;
    }

    moduloInformacion.forEach((modulo) => {
      // buscamos y obtememos el item perteneciente al alias
      const categoriaItemFound = modulo.children?.find(
        (element) => element.nombre === alias
      );

      if (categoriaItemFound) {
        categoriaItem = categoriaItemFound;
      }
    });

    return categoriaItem;
  }
}
