import { Component, OnInit} from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { switchMap, tap } from 'rxjs';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Empresa } from '@interfaces/usuario/empresa';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { General } from '@comun/clases/general';
import { SubdominioService } from '@comun/services/subdominio.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent extends General implements OnInit {
  arrEmpresas: Empresa[] = [];

  constructor(private empresaService: EmpresaService, private subdominioService: SubdominioService) {
    super();
  }

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    let suscripcion = this.store
      .select(obtenerUsuarioId)
      .pipe(switchMap((usuarioId) => this.empresaService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrEmpresas = respuesta.empresas;
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
    const consultaEmpresa = this.empresaService
      .detalle(`${empresaSeleccionada}`)
      .subscribe((respuesta) => {
        const empresa: Empresa = {
          nombre: respuesta.nombre,
          imagen:
            'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
          inquilino_id: respuesta.id,
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
          telefono: ''
        };
        this.store.dispatch(empresaActionInit({ empresa }));
        if(environment.production){
          window.location.href = `http://${respuesta.subdominio}.muup.online/dashboard`;
        }else{
          this.router.navigate(['/dashboard'])
        }
      });
  }

  eliminarEmpresa(empresa_subdominio: string | null, empresa_id: Number) {
    const mensajes = this.translateService.instant([
      'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESATITULO',
      'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESASUBTITULO',
      'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESAAYUDA',
      'FORMULARIOS.BOTONES.COMUNES.ELIMINAR',
      'FORMULARIOS.BOTONES.COMUNES.CANCELAR',
    ]);

    this.alertaService
      .mensajeEliminarEmpresa(
        empresa_subdominio,
        mensajes['FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESATITULO'],
        mensajes['FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESASUBTITULO'],
        mensajes['FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESAAYUDA'],
        mensajes['FORMULARIOS.BOTONES.COMUNES.ELIMINAR'],
        mensajes['FORMULARIOS.BOTONES.COMUNES.CANCELAR']
      )
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (respuesta.value === empresa_subdominio) {
            let suscripcion = this.empresaService
              .eliminarEmpresa(empresa_id)
              .pipe(
                tap(() => {
                  this.alertaService.mensajaExitoso(
                   this.translateService.instant("FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION")
                  );
                  this.consultarLista()
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

  navegarAinvitaciones(empresa: Empresa) {
    this.router.navigateByUrl(
      `/empresa/${empresa.inquilino_id}/invitacion/nuevo`,
      { state: { empresa: empresa } }
    );
  }

  detalleEmpresa(inquilino_id: Number){
    this.router.navigate([`/empresa/detalle/${inquilino_id}`]);
  }
}
