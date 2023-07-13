import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { AlertaService } from '@comun/services/alerta.service';
import { Empresa, EmpresaLista } from '@interfaces/usuario/empresa';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent implements OnInit {
  arrEmpresas: Empresa[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private empresaService: EmpresaService,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    let suscripcion = this.store
      .select(obtenerId)
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
          empresa_id: 1,
          subdominio: respuesta.subdominio,
          id: 1,
          usuario_id: 1,
          seleccion: true,
          rol: respuesta.rol,
          plan_id: null,
          plan_nombre: null,
          usuarios: 1,
        };
        this.store.dispatch(empresaActionInit({ empresa }));
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
        mensajes['FORMULARIOS.BOTONES.COMUNES.CANCELAR'],
      )
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (respuesta.value === empresa_subdominio) {
            let suscripcion = this.empresaService
              .eliminarEmpresa(empresa_id)
              .pipe(
                tap(() => {
                  this.alertaService.mensajaExitoso(
                    'Empresa eliminada',
                    'Por favor espere, procesando eliminación'
                  );
                  setTimeout(() => {
                    location.reload();
                  }, 5001);
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

  navegarAinvitaciones (empresa: Empresa){
    this.router.navigateByUrl(`/empresa/${empresa.empresa_id}/invitacion/nuevo`, { state: {"empresa": empresa} });
  }
}
