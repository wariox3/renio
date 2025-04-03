import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { SkeletonLoadingComponent } from '@comun/componentes/skeleton-loading/skeleton-loading.component';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  configuracionVisualizarAppsAction,
  configuracionVisualizarBreadCrumbsAction,
} from '@redux/actions/configuracion.actions';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
import { empresaLimpiarAction } from '@redux/actions/empresa.actions';
import { selecionModuloAction } from '@redux/actions/menu.actions';
import {
  obtenerUsuarioFechaLimitePago,
  obtenerUsuarioId,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import {
  catchError,
  combineLatest,
  debounceTime,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ContenedorService } from '../../servicios/contenedor.service';
import { ContenedorEditarComponent } from '../contenedor-editar/contenedor-editar.component';
import { ContenedorInvitacionComponent } from '../contenedor-invitacion/contenedor-invitacion.component';
import { FormsModule } from '@angular/forms';

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
    ContenedorInvitacionComponent,
    ContenedorEditarComponent,
    FormsModule,
  ],
})
export class ContenedorListaComponent extends General implements OnInit {
  contenedores = signal<Contenedor[]>([]);
  fechaActual = new Date();
  usuarioFechaLimitePago: Date;
  dominioApp = environment.dominioApp;
  cargandoContederes = false;
  habilitarContenedores = true;
  usuarioSaldo = 0;
  VisalizarMensajeBloqueo = false;
  visualizarLoader: boolean[] = [];
  contenedorId: number;
  contenedor: Contenedor;
  procesando = false;
  searchTerm: string = '';

  constructor(
    private contenedorService: ContenedorService,
    private subdominioService: SubdominioService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.cargandoContederes = true;
    this.changeDetectorRef.detectChanges();

    this.store.dispatch(
      asignarDocumentacion({ id: 666, nombre: 'CONTENEDORES' }),
    );

    this.consultarLista();
    this.limpiarEmpresa();

    combineLatest([
      this.store.select(obtenerUsuarioFechaLimitePago),
      this.store.select(obtenerUsuarioVrSaldo),
    ]).subscribe((respuesta) => {
      this.usuarioFechaLimitePago = new Date(respuesta[0]);
      this.usuarioFechaLimitePago.setDate(
        this.usuarioFechaLimitePago.getDate() + 1,
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
    this.modalService.dismissAll();
    this.cargandoContederes = true;
    //this.visualizarLoader = true;
    this.changeDetectorRef.detectChanges();
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.lista(respuestaUsuarioId),
        ),
        tap((respuestaLista) => {
          respuestaLista.contenedores.forEach(() =>
            this.visualizarLoader.push(false),
          );
          this.VisalizarMensajeBloqueo = !!respuestaLista.contenedores.find(
            (contenedor) => contenedor.acceso_restringido === true,
          );
          this.contenedores.set(respuestaLista.contenedores);
          this.cargandoContederes = false;
          this.changeDetectorRef.detectChanges();
        }),
        catchError(({ error }) => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`,
          );
          return of(null);
        }),
      )
      .subscribe();
  }

  seleccionarEmpresa(subdominio: string, i: number) {
    this.visualizarLoader[i] = true;
    this.contenedorService
      .contenedorConectar(subdominio)
      .pipe(
        tap((respuesta) => {
          this.alertaService.cerrarMensajes();
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
            configuracionVisualizarAppsAction({
              configuracion: {
                visualizarApps: true,
              },
            }),
          );
          this.store.dispatch(
            configuracionVisualizarBreadCrumbsAction({
              configuracion: {
                visualizarBreadCrumbs: true,
              },
            }),
          );
          this.store.dispatch(selecionModuloAction({ seleccion: 'general' }));
          this.visualizarLoader[i] = false;
          this.changeDetectorRef.detectChanges();
          this.router.navigateByUrl('/general');
        }),
        catchError(() => {
          this.visualizarLoader[i] = false;
          this.changeDetectorRef.detectChanges();
          return of(null);
        }),
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
        mensajes['FORMULARIOS.BOTONES.COMUNES.CANCELAR'],
      )
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (respuesta.value === empresa_subdominio) {
            this.procesando = true;
            this.changeDetectorRef.detectChanges();
            this.contenedorService
              .eliminarEmpresa(empresa_id)
              .pipe(
                tap(() => {
                  this.alertaService.mensajaExitoso(
                    this.translateService.instant(
                      'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION',
                    ),
                  );
                  this.consultarLista();
                }),
                debounceTime(500),
                finalize(() => {
                  this.procesando = false;
                }),
              )
              .subscribe();
          } else {
            this.procesando = false;
            this.alertaService.mensajeError(
              'Error',
              'El nombre ingresado con es valido',
            );
          }
        }
      });
  }

  navegarAinvitaciones(empresa: Contenedor) {
    this.router.navigateByUrl(
      `/contenedor/${empresa.contenedor_id}/invitacion/nuevo`,
      { state: { empresa: empresa } },
    );
  }

  detalleEmpresa(contenedor_id: Number) {
    this.router.navigate([`/contenedor/detalle/${contenedor_id}`]);
  }

  limpiarEmpresa() {
    this.store.dispatch(
      configuracionVisualizarAppsAction({
        configuracion: {
          visualizarApps: false,
        },
      }),
    );
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      }),
    );
    
    this.store.dispatch(empresaLimpiarAction());
  }

  getImageUrl(baseImageUrl: string): string {
    return `${baseImageUrl}?t=${new Date().getTime()}`;
  }

  abrirModal(content: any, contenedor_id: number, contenedor: Contenedor) {
    this.contenedorId = contenedor_id;
    this.contenedor = contenedor;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.changeDetectorRef.detectChanges();
  }

  get filteredContenedores() {
    if (!this.searchTerm) {
      return this.contenedores(); // Si no hay término de búsqueda, devuelve todos los items
    }

    return this.contenedores().filter((item) =>
      item?.nombre?.toLowerCase().includes(this.searchTerm?.toLowerCase()),
    );
  }
}
