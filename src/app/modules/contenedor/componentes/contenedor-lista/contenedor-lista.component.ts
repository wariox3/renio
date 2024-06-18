import { Component, OnInit } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { General } from '@comun/clases/general';
import { environment } from '@env/environment';
import { empresaLimpiarAction } from '@redux/actions/empresa.actions';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SkeletonLoadingComponent } from '@comun/componentes/skeleton-loading/skeleton-loading.component';

@Component({
  selector: 'app-contenedor-lista',
  templateUrl: './contenedor-lista.component.html',
  styleUrls: ['./contenedor-lista.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    TranslationModule,
    CardComponent,
    AnimationFadeinUpDirective,
    NgOptimizedImage,
    NgIf,
    NgFor,
    NgbDropdownModule,
    SkeletonLoadingComponent,
    NgOptimizedImage,
  ],
})
export class ContenedorListaComponent extends General implements OnInit {
  arrContenedores: Contenedor[] = [];
  dominioApp = environment.dominioApp;
  cargandoContederes = false;
  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit() {
    this.consultarLista();
    this.limpiarEmpresa();
  }

  consultarLista() {
    this.cargandoContederes = true;
    this.changeDetectorRef.detectChanges();
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.lista(respuestaUsuarioId)
        ),
        tap((respuestaLista) => {
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

  seleccionarEmpresa(empresaSeleccionada: Number) {
    this.contenedorService
      .detalle(`${empresaSeleccionada}`)
      .subscribe((respuesta) => {
        const contenedor: Contenedor = {
          nombre: respuesta.nombre,
          imagen:
            'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
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
        };
        this.store.dispatch(ContenedorActionInit({ contenedor }));
        this.store.dispatch(
          configuracionVisualizarAction({
            configuracion: {
              visualizarApps: true,
            },
          })
        );
        if (environment.production) {
          window.location.href = `${environment.dominioHttp}://${respuesta.subdominio}${environment.dominioApp}/dashboard`;
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      });
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
    if (window.location.host.includes(environment.dominioApp)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/contenedor/lista']);
    }
  }
}
