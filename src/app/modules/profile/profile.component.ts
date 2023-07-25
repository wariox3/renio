import { Component, OnInit } from '@angular/core';
import { obtenerEmpresaNombre } from '@redux/selectors/empresa.selectors';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioNombre,
  obtenerUsuarioNombreCompleto,
  obtenerUsuarioNombreCorto,
  obtenerUsuarioTelefono,
} from '@redux/selectors/usuario.selectors';

import { General } from '@comun/clases/general';
import { ResumenService } from './services/resumen.service';
import { switchMap, tap } from 'rxjs';
import { usuarioActionActualizarImagen } from '@redux/actions/usuario.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent extends General {
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);

  constructor(private resumenService: ResumenService) {
    super();
  }

  empresaNombre = this.store.select(obtenerEmpresaNombre);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  nombreMostrar = this.store.select(obtenerUsuarioNombreCorto);
  telefono = this.store.select(obtenerUsuarioTelefono);
  usuarioNombreCompleto = this.store.select(obtenerUsuarioNombreCompleto);

  recuperarBase64(event: any) {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) =>
          this.resumenService.cargarImagen(codigoUsuario, event)
        ),
        tap((respuestaCargarImagen) => {
          if (respuestaCargarImagen.cargar) {
            this.store.dispatch(
              usuarioActionActualizarImagen({imagen: respuestaCargarImagen.imagen})
            )
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.ACTUALIZACION'
              )
            );
          }
        })
      )
      .subscribe();
  }

  eliminarLogo(event: boolean) {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) =>
          this.resumenService.eliminarImagen(codigoUsuario)
        ),
        tap((respuestaEliminarImagen) => {
          if (respuestaEliminarImagen.limpiar) {
            this.store.dispatch(
              usuarioActionActualizarImagen({imagen: respuestaEliminarImagen.imagen})
            )
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.ACTUALIZACION'
              )
            );
          }
        })
      )
      .subscribe();
  }
}
