import { Component, OnInit } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { switchMap, tap } from 'rxjs';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { General } from '@comun/clases/general';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';
import { empresaLimpiarAction } from '@redux/actions/empresa.actions';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';

@Component({
  selector: 'app-contenedor-lista',
  templateUrl: './contenedor-lista.component.html',
  styleUrls: ['./contenedor-lista.component.scss'],
})
export class ContenedorListaComponent extends General implements OnInit {
  arrContenedores: Contenedor[] = [];

  constructor(
    private contenedorService: ContenedorService,
    private subdominioService: SubdominioService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarLista();
    this.limpiarEmpresa();
  }

  consultarLista() {
    let suscripcion = this.store
      .select(obtenerUsuarioId)
      .pipe(switchMap((usuarioId) => this.contenedorService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrContenedores = respuesta.contenedores;
          this.changeDetectorRef.detectChanges();
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
  }

  seleccionarEmpresa(empresaSeleccionada: Number) {
    const consultaEmpresa = this.contenedorService
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
          plan_id: null,
          plan_nombre: null,
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
          window.location.href = `http://${respuesta.subdominio}.reddoc.onl/dashboard`;
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
    let dominioActual = window.location.host;
    let esSubdominio = dominioActual.split('.').length > 2;
    if (esSubdominio) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/contenedor/lista']);
    }
  }
}
