import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { SkeletonLoadingComponent } from 'src/app/common/components/skeleton-loading/skeleton-loading.component';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';
import { Contenedor, ContenedorLista, Modulos } from '@interfaces/usuario/contenedor';
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
  obtenerUsuarioSocio,
  obtenerUsuarioVrSaldo,
  obtenerUsuarioEsAdministrador,
} from '@redux/selectors/usuario.selectors';
import {
  catchError,
  combineLatest,
  debounceTime,
  finalize,
  of,
  switchMap,
  tap,
  distinctUntilChanged,
} from 'rxjs';
import { ContenedorService } from '../../servicios/contenedor.service';
import { ContenedorInvitacionComponent } from '../contenedor-invitacion/contenedor-invitacion.component';
import { FormsModule } from '@angular/forms';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { ModulosManagerInit } from '@redux/actions/modulos-manager.action';
import { Store } from '@ngrx/store';

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
    FormsModule,
    PaginadorComponent,
  ],
})
export class ContenedorListaComponent extends General implements OnInit {
  private contenedorService = inject(ContenedorService);

  contenedores = signal<ContenedorLista[]>([]);
  fechaActual = new Date();
  usuarioFechaLimitePago: Date;
  dominioApp = environment.dominioApp;
  cargandoContederes = false;
  habilitarContenedores = true;
  usuarioSaldo = 0;
  VisalizarMensajeBloqueo = false;
  visualizarLoader: boolean[] = [];
  contenedorId: number;
  contenedor: ContenedorLista;
  procesando = false;
  searchTerm: string = '';
  currentPage = signal<number>(1);
  digitalOceanUrl = environment.digitalOceanUrl;
  private searchTerms = new Subject<string>();
  esSocio = signal<boolean>(false);

  constructor(
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
    
    // Configurar la búsqueda con debounce
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(term => {
      this.searchTerm = term;
      this.consultarLista();
    });

    combineLatest([
      this.store.select(obtenerUsuarioFechaLimitePago),
      this.store.select(obtenerUsuarioVrSaldo),
      this.store.select(obtenerUsuarioSocio),
    ]).subscribe((respuesta) => {
      this.esSocio.set(respuesta[2]);
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
    combineLatest([
      this.store.select(obtenerUsuarioId),
      this.store.select(obtenerUsuarioEsAdministrador)
    ])
      .pipe(
        switchMap(([respuestaUsuarioId, esAdministrador]) => {
          const params: Record<string, any> = { 
            page: this.currentPage(),
          };
          
          // Solo agregar usuario_id si NO es administrador
          if (!esAdministrador) {
            params['usuario_id'] = respuestaUsuarioId;
          } else {
            params['rol'] = 'propietario';
          }
          
          // Agregar el parámetro de búsqueda solo si hay un término
          if (this.searchTerm) {
            params['contenedor__nombre'] = this.searchTerm;
          }
          
          return this.contenedorService.lista(params);
        }),
        
        tap((respuestaLista) => {
          respuestaLista.results.forEach(() =>
            this.visualizarLoader.push(false),
          );
          this.VisalizarMensajeBloqueo = !!respuestaLista.results.find(
            (contenedor) => contenedor.acceso_restringido === true,
          );
          this.contenedores.set(respuestaLista.results);
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

  seleccionarEmpresa(subdominio: string, rol: string, i: number) {
    this.visualizarLoader[i] = true;
    this.contenedorService
      .contenedorConectar(subdominio)
      .pipe(
        tap((respuesta) => {
          this.alertaService.cerrarMensajes();

          // const contenedor: Contenedor = {
          //   nombre: respuesta.nombre,
          //   imagen:
          //     'https://semantica.sfo3.digitaloceanspaces.com/itrio/test/empresa/logo_defecto.jpg',
          //   contenedor_id: respuesta.id,
          //   subdominio: respuesta.subdominio,
          //   id: respuesta.id,
          //   usuario_id: 1,
          //   seleccion: true,
          //   rol: respuesta.rol,
          //   plan_id: respuesta.plan_id,
          //   plan_nombre: respuesta.plan_nombre,
          //   usuarios: 1,
          //   usuarios_base: 0,
          //   ciudad: 0,
          //   correo: '',
          //   direccion: '',
          //   identificacion: 0,
          //   nombre_corto: '',
          //   numero_identificacion: 0,
          //   telefono: '',
          //   acceso_restringido: respuesta.acceso_restringido,
          // };

          const contenedor: Contenedor = {
            id: 0,
            usuario_id: respuesta.usuario_id,
            contenedor_id: respuesta.id,
            rol: rol,
            plan_id: respuesta.plan_id,
            subdominio: respuesta.subdominio,
            nombre: respuesta.nombre,
            imagen: respuesta.imagen,
            usuarios: respuesta.plan_limite_usuarios,
            usuarios_base: respuesta.plan_usuarios_base,
            plan_nombre: respuesta.plan_nombre,
            reddoc: respuesta.reddoc,
            ruteo: respuesta.ruteo,
            acceso_restringido: respuesta.acceso_restringido,
            seleccion: true,
          };

          console.log(contenedor);


          const modulos: Modulos = {
            plan_cartera: respuesta.plan_cartera,
            plan_compra: respuesta.plan_compra,
            plan_contabilidad: respuesta.plan_contabilidad,
            plan_humano: respuesta.plan_humano,
            plan_inventario: respuesta.plan_inventario,
            plan_tesoreria: respuesta.plan_tesoreria,
            plan_venta: respuesta.plan_venta,
          };

          this.store.dispatch(
            ModulosManagerInit({
              modulos,
            }),
          );
          this.store.dispatch(ContenedorActionInit({ contenedor: contenedor }));
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
                  this.currentPage.set(1);
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

  navegarAEditar(contenedor_id: number) {
    this.router.navigate(['/contenedor/editar', contenedor_id]);
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

  abrirModal(content: any, contenedor_id: number, contenedor: ContenedorLista) {
    this.contenedorId = contenedor_id;
    this.contenedor = contenedor;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.changeDetectorRef.detectChanges();
  }

  get filteredContenedores() {
    return this.contenedores();
  }
  
  // Método para manejar cambios en el input de búsqueda
  onSearchChange(term: string) {
    this.currentPage.set(1);
    this.searchTerms.next(term);
  }
  
  cambiarPaginacion(page: number) {
    this.currentPage.set(page);
    this.consultarLista();
  }
  
  get totalItems(): number {
    return this.contenedorService.totalItems || 0;
  }
}
