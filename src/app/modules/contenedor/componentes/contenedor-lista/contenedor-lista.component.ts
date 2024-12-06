import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { SkeletonLoadingComponent } from '@comun/componentes/skeleton-loading/skeleton-loading.component';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { empresaLimpiarAction } from '@redux/actions/empresa.actions';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioId,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { ContenedorService } from '../../servicios/contenedor.service';

@Component({
  selector: 'app-contenedor-lista',
  templateUrl: './contenedor-lista.component.html',
  styleUrls: ['./contenedor-lista.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    AnimationFadeInUpDirective,
    NgIf,
    NgFor,
    CommonModule,
    NgbDropdownModule,
    SkeletonLoadingComponent,
  ],
})
export class ContenedorListaComponent extends General implements OnInit {
  arrContenedores: Contenedor[] = [];
  fechaActual = new Date();
  usuarioFechaLimitePago: Date;
  dominioApp = environment.dominioApp;
  cargandoContederes = false;
  habilitarContenedores = true;
  usuarioSaldo = 0;
  VisalizarMensajeBloqueo = false;
  visualizarLoader: boolean[] = [];

  constructor(
    private contenedorService: ContenedorService,
    private subdominioService: SubdominioService
  ) {
    super();
  }

  ngOnInit() {
    this.cargandoContederes = true;
    this.changeDetectorRef.detectChanges();

    if (this.subdominioService.esSubdominioActual()) {
      location.href = `${
        environment.dominioHttp
      }://${environment.dominioApp.slice(1)}/contenedor/lista`;
    }

    this.consultarLista();
    this.limpiarEmpresa();

    combineLatest([
      this.store.select(obtenerUsuarioFechaLimitePago),
      this.store.select(obtenerUsuarioVrSaldo),
    ]).subscribe((respuesta) => {
      this.usuarioFechaLimitePago = new Date(respuesta[0]);
      this.usuarioFechaLimitePago.setDate(
        this.usuarioFechaLimitePago.getDate() + 1
      );
      this.usuarioSaldo = respuesta[1];

      if (
        this.usuarioSaldo > 0 &&
        this.usuarioFechaLimitePago < this.fechaActual
      ) {
        this.habilitarContenedores = false;
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  consultarLista() {
    this.cargandoContederes = true;
    //this.visualizarLoader = true;
    this.changeDetectorRef.detectChanges();
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.lista(respuestaUsuarioId)
        ),
        tap((respuestaLista) => {
          respuestaLista.contenedores.forEach(() =>
            this.visualizarLoader.push(false)
          );
          this.VisalizarMensajeBloqueo = !!respuestaLista.contenedores.find(
            (contenedor) => contenedor.acceso_restringido === true
          );
          this.arrContenedores = respuestaLista.contenedores;
          this.cargandoContederes = false;
          this.changeDetectorRef.detectChanges();
        }),
        catchError(({ error }) => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
          return of(null);
        })
      )
      .subscribe();
  }

  seleccionarEmpresa(empresaSeleccionada: number, i: number) {
    this.visualizarLoader[i] = true;
    this.contenedorService
      .detalle(`${empresaSeleccionada}`)
      .pipe(
        tap((respuesta) => {
          const contenedor: Contenedor = {
            nombre: respuesta.nombre,
            imagen:
              'https://semantica.sfo3.digitaloceanspaces.com/itrio/test/empresa/logo_defecto.jpg',
            contenedor_id: respuesta.id,
            subdominio: respuesta.subdominio,
            id: respuesta.id,
            usuario_id: 1,
            seleccion: true,
            rol: respuesta.rol,
            plan_id: respuesta.plan_id,
            plan_nombre: respuesta.plan_nombre,
            usuarios: 1,
            usuarios_base: 0,
            ciudad: 0,
            correo: '',
            direccion: '',
            identificacion: 0,
            nombre_corto: '',
            numero_identificacion: 0,
            telefono: '',
            acceso_restringido: respuesta.acceso_restringido,
          };
          this.store.dispatch(ContenedorActionInit({ contenedor }));
          this.store.dispatch(
            configuracionVisualizarAction({
              configuracion: {
                visualizarApps: true,
              },
            })
          );
          this.visualizarLoader[i] = false;
          this.changeDetectorRef.detectChanges();
          if (environment.production) {
            window.location.href = `${environment.dominioHttp}://${respuesta.subdominio}${environment.dominioApp}/dashboard`;
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        }),
        catchError(() => {
          this.visualizarLoader[i] = false;
          this.changeDetectorRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }

  eliminarEmpresa(empresa_subdominio: string | null, empresa_id: Number) {
    const mensajes = this.translateService.instant([
      'FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORTITULO',
      'FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORSUBTITULO',
      'FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORAYUDA',
      'FORMULARIOS.BOTONES.COMUNES.ELIMINAR',
      'FORMULARIOS.BOTONES.COMUNES.CANCELAR',
    ]);

    this.alertaService
      .mensajeEliminarEmpresa(
        empresa_subdominio,
        mensajes['FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORTITULO'],
        mensajes['FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORSUBTITULO'],
        mensajes['FORMULARIOS.MENSAJES.CONTENEDOR.ELIMINARCONTENEDORAYUDA'],
        mensajes['FORMULARIOS.BOTONES.COMUNES.ELIMINAR'],
        mensajes['FORMULARIOS.BOTONES.COMUNES.CANCELAR']
      )
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (respuesta.value === empresa_subdominio) {
            let suscripcion = this.contenedorService
              .eliminarEmpresa(empresa_id)
              .pipe(
                tap(() => {
                  this.alertaService.mensajaExitoso(
                    this.translateService.instant(
                      'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION'
                    )
                  );
                  this.consultarLista();
                })
              )
              .subscribe();
          } else {
            this.alertaService.mensajeError(
              'Error',
              'El nombre ingresado con es valido'
            );
          }
        }
      });
  }

  navegarAinvitaciones(empresa: Contenedor) {
    this.router.navigateByUrl(
      `/contenedor/${empresa.contenedor_id}/invitacion/nuevo`,
      { state: { empresa: empresa } }
    );
  }

  detalleEmpresa(contenedor_id: Number) {
    this.router.navigate([`/contenedor/detalle/${contenedor_id}`]);
  }

  limpiarEmpresa() {
    this.store.dispatch(
      configuracionVisualizarAction({
        configuracion: {
          visualizarApps: false,
        },
      })
    );
    this.store.dispatch(empresaLimpiarAction());
  }

  getImageUrl(baseImageUrl: string): string {
    return `${baseImageUrl}?t=${new Date().getTime()}`;
  }
}
