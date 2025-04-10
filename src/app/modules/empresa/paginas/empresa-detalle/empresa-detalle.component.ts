import { Component, OnDestroy, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionImangenAction } from '@redux/actions/empresa.actions';
import {
  obtenerEmpresaImagen,
  obtenerEmpresaInformacion,
} from '@redux/selectors/empresa.selectors';
import { of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EmpresaEditarComponent } from '../empresa-editar/empresa-editar.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../_metronic/shared/shared.module';
import { CargarImagenComponent } from '../../../../comun/componentes/cargar-imagen/cargar-imagen.component';
import { RouterModule } from '@angular/router';
import { Empresa } from '@interfaces/contenedor/empresa.interface';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  standalone: true,
  imports: [
    CargarImagenComponent,
    SharedModule,
    TranslateModule,
    EmpresaEditarComponent,
    AsyncPipe,
    RouterModule,
  ],
})
export class EmpresaDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  empresa_id = this.activatedRoute.snapshot.paramMap.get('empresacodigo')!;
  obtenerEmpresaImagen$ = this.store.select(obtenerEmpresaImagen);
  informacionEmpresa: Empresa = {
    id: 0,
    numero_identificacion: '',
    digito_verificacion: '',
    identificacion_nombre: '',
    nombre_corto: '',
    direccion: '',
    telefono: '',
    correo: '',
    imagen: '',
    ciudad_id: 0,
    identificacion_id: 0,
    regimen_id: 0,
    regimen_nombre: '',
    tipo_persona_id: 0,
    tipo_persona_nombre: '',
    suscriptor: 0,
    rededoc_id: '',
    asistente_electronico: false,
    asistente_predeterminado: false,
  };

  constructor(private empresaServices: EmpresaService) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      })
    );
    this.store
      .select(obtenerEmpresaInformacion)
      .subscribe((empresa) => (this.informacionEmpresa = empresa));
  }

  recuperarBase64(event: any) {
    this.empresaServices.cargarLogo(this.empresa_id, event).subscribe({
      next: (respuesta) => {
        if (respuesta.cargar) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.CARGARIMAGEN'
            )
          );
          this.store.dispatch(
            empresaActualizacionImangenAction({
              imagen: respuesta.imagen,
            })
          );
          this.changeDetectorRef.detectChanges();
        }
      },
    });
  }

  eliminarLogo(event: boolean) {
    this.empresaServices
      .eliminarLogoEmpresa(this.empresa_id)
      .pipe(
        switchMap((respuestaEliminarLogoEmpresa) => {
          if (respuestaEliminarLogoEmpresa.limpiar) {
            this.store.dispatch(
              empresaActualizacionImangenAction({
                imagen: respuestaEliminarLogoEmpresa.imagen,
              })
            );
          }
          return of(null);
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
