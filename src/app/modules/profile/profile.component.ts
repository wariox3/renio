import { Component, OnInit } from '@angular/core';
import { obtenerContenedorNombre } from '@redux/selectors/contenedor.selectors';
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
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InformacionUsuarioComponent } from './components/informacion-usuario/informacion-usuario.component';
import { KeeniconComponent } from '../../_metronic/shared/keenicon/keenicon.component';
import { CargarImagenComponent } from '../../comun/componentes/cargar-imagen/cargar-imagen.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: true,
    imports: [
        CargarImagenComponent,
        KeeniconComponent,
        InformacionUsuarioComponent,
        RouterLink,
        RouterLinkActive,
        TranslateModule,
        RouterOutlet,
        AsyncPipe,
    ],
})
export class ProfileComponent extends General {
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  contenedorNombre = this.store.select(obtenerContenedorNombre);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  usuarioNombreMostrar = this.store.select(obtenerUsuarioNombreCorto);
  usuarioNombreCompleto = this.store.select(obtenerUsuarioNombreCompleto);
  usuarioTelefono = this.store.select(obtenerUsuarioTelefono);

  constructor(private resumenService: ResumenService) {
    super();
  }

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
              usuarioActionActualizarImagen({
                imagen: respuestaCargarImagen.imagen,
              })
            );
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
              usuarioActionActualizarImagen({
                imagen: respuestaEliminarImagen.imagen,
              })
            );
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
