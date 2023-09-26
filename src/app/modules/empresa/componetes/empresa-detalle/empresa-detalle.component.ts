import { Component } from '@angular/core';
import { General } from '@comun/clases/general';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { obtenerEmpresaDireccion, obtenerEmpresaImagen, obtenerEmpresaNombre, obtenerEmpresaNumeroIdenticionDigitoVerificacion, obtenerEmpresaTelefono } from '@redux/selectors/empresa.selectors';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.scss'],
})
export class EmpresaDetalleComponent extends General {


  contenedor_id = this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
  informacionEmpresa$ = this.store.select(obtenerEmpresaNombre)
  obtenerEmpresaImagen$ = this.store.select(obtenerEmpresaImagen)
  obtenerEmpresaDireccion$ = this.store.select(obtenerEmpresaDireccion)
  obtenerEmpresaTelefono$ = this.store.select(obtenerEmpresaTelefono)
  obtenerEmpresaNumeroIdenticionDigitoVerificacion$ = this.store.select(obtenerEmpresaNumeroIdenticionDigitoVerificacion)

  constructor(private empresaServices: EmpresaService) {
    super();
  }


  recuperarBase64(event: any) {
    this.empresaServices.cargarLogo(this.contenedor_id, event).subscribe({
      next: (respuesta) => {
        if (respuesta.cargar) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.CARGARIMAGEN'
            )
          );
          this.changeDetectorRef.detectChanges();
        }
      },
    });
  }

  eliminarLogo(event: boolean) {
    this.empresaServices
      .eliminarLogoEmpresa(this.contenedor_id)
      .pipe(
        switchMap((respuestaEliminarLogoEmpresa) => {
          if (respuestaEliminarLogoEmpresa.limpiar) {
            //this.consultarDetalle();
          }
          return of(null);
        })
      )
      .subscribe();
  }
}
