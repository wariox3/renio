import { Component } from '@angular/core';
import { General } from '@comun/clases/general';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionImangenAction } from '@redux/actions/empresa.actions';
import {
  obtenerEmpresaDireccion,
  obtenerEmpresaImagen,
  obtenerEmpresaNombre,
  obtenerEmpresaNumeroIdenticionDigitoVerificacion,
  obtenerEmpresaTelefono,
} from '@redux/selectors/empresa.selectors';
import { of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EmpresaEditarComponent } from '../empresa-editar/empresa-editar.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../_metronic/shared/shared.module';
import { CargarImagenComponent } from '../../../../comun/componentes/cargar-imagen/cargar-imagen.component';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.scss'],
  standalone: true,
  imports: [
    CargarImagenComponent,
    SharedModule,
    TranslateModule,
    EmpresaEditarComponent,
    AsyncPipe,
  ],
})
export class EmpresaDetalleComponent extends General {
  empresa_id = this.activatedRoute.snapshot.paramMap.get('empresacodigo')!;
  informacionEmpresa$ = this.store.select(obtenerEmpresaNombre);
  obtenerEmpresaImagen$ = this.store.select(obtenerEmpresaImagen);
  obtenerEmpresaDireccion$ = this.store.select(obtenerEmpresaDireccion);
  obtenerEmpresaTelefono$ = this.store.select(obtenerEmpresaTelefono);
  obtenerEmpresaNumeroIdenticionDigitoVerificacion$ = this.store.select(
    obtenerEmpresaNumeroIdenticionDigitoVerificacion
  );

  constructor(private empresaServices: EmpresaService) {
    super();
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
}
