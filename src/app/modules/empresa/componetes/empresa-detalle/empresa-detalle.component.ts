import { Component } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerEmpresaImagen, obtenerEmpresaNombre } from '@redux/selectors/empresa.selectors';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.scss'],
})
export class EmpresaDetalleComponent extends General {


  contenedor_id = this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
  informacionEmpresa$ = this.store.select(obtenerEmpresaNombre)
  obtenerEmpresaImagen$ = this.store.select(obtenerEmpresaImagen)

  constructor() {
    super();
  }


  recuperarBase64(event: any) {
    // this.contenedorService.cargarLogo(this.contenedor_id, event).subscribe({
    //   next: (respuesta) => {
    //     if (respuesta.cargar) {
    //       this.alertaService.mensajaExitoso(
    //         this.translateService.instant(
    //           'FORMULARIOS.MENSAJES.COMUNES.CARGARIMAGEN'
    //         )
    //       );
    //       this.changeDetectorRef.detectChanges();
    //     }
    //   },
    // });
  }

  eliminarLogo(event: boolean) {
    // this.contenedorService
    //   .eliminarLogoEmpresa(this.contenedor_id)
    //   .pipe(
    //     switchMap((respuestaEliminarLogoEmpresa) => {
    //       if (respuestaEliminarLogoEmpresa.limpiar) {
    //         this.consultarDetalle();
    //       }
    //       return of(null);
    //     })
    //   )
    //   .subscribe();
  }
}
