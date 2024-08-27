import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { obtenerContenedorSeleccion } from '@redux/selectors/contenedor.selectors';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { zip } from 'rxjs';

export const validarRutaGuard: CanActivateChildFn = (childRoute, state) => {
  const store = inject(Store);
  const router = inject(Router);
  let fechaActual = new Date();
  let usuarioFechaLimitePago: Date;
  let usuarioSaldo = 0;
  let persimsos = true;
  zip([
    store.select(obtenerUsuarioFechaLimitePago),
    store.select(obtenerUsuarioVrSaldo),
    store.select(obtenerContenedorSeleccion),
  ]).subscribe((respuesta) => {
    usuarioFechaLimitePago = new Date(respuesta[0]);
    usuarioFechaLimitePago.setDate(usuarioFechaLimitePago.getDate() + 1);
    usuarioSaldo = respuesta[1];
    if (usuarioSaldo > 0 && usuarioFechaLimitePago < fechaActual) {
      persimsos = false;
    } else {
      if (respuesta[2] === false) {
        persimsos = false;
      }
    }
  });

  if (!persimsos) {
    //router.navigate(['/contenedor/lista']);
    location.href = `${
      environment.dominioHttp
    }://${environment.dominioApp.slice(1)}/contenedor/lista`;

  }

  return persimsos;
};