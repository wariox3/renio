import { Component, OnDestroy, OnInit } from '@angular/core';
import { obtenerContenedorNombre } from '@redux/selectors/contenedor.selectors';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioNombreCompleto,
  obtenerUsuarioNombreCorto,
  obtenerUsuarioTelefono,
  obtenerUsuarioUserName,
} from '@redux/selectors/usuario.selectors';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { usuarioActionActualizarImagen } from '@redux/actions/usuario.actions';
import { switchMap, tap } from 'rxjs';
import { KeeniconComponent } from '../../_metronic/shared/keenicon/keenicon.component';
import { CargarImagenComponent } from '../../comun/componentes/cargar-imagen/cargar-imagen.component';
import { InformacionUsuarioComponent } from './components/informacion-usuario/informacion-usuario.component';
import { ResumenService } from './services/resumen.service';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';

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
export class ProfileComponent extends General implements OnInit, OnDestroy {
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  contenedorNombre = this.store.select(obtenerContenedorNombre);
  usuarioCorreo = this.store.select(obtenerUsuarioUserName);
  usuarioNombreMostrar = this.store.select(obtenerUsuarioNombreCorto);
  usuarioNombreCompleto = this.store.select(obtenerUsuarioNombreCompleto);
  usuarioTelefono = this.store.select(obtenerUsuarioTelefono);

  constructor(private resumenService: ResumenService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(configuracionVisualizarBreadCrumbsAction({
      configuracion: {
        visualizarBreadCrumbs: false
      }
    }))
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

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes();
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: true,
        },
      })
    );
  }
}
