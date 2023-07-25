import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { Empresa } from '@interfaces/usuario/empresa';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { of, pipe, switchMap } from 'rxjs';

@Component({
  selector: 'app-empresa-detalle',
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.scss'],
})
export class EmpresaDetalleComponent extends General implements OnInit {
  empresa_id = this.activatedRoute.snapshot.paramMap.get('codigoempresa')!;
  informacionEmpresa: Empresa = {
    empresa_id: 0,
    id: 0,
    imagen: '',
    nombre: '',
    subdominio: '',
    usuario_id: 0,
    rol: '',
    usuarios: 0,
    plan_id: 0,
    plan_nombre: 0,
    usuarios_base: 0,
  };

  constructor(private empresaService: EmpresaService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.empresaService
      .consultarInformacion(this.empresa_id)
      .subscribe((respuesta: any) => {
        this.informacionEmpresa = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  recuperarBase64(event: any) {
    this.empresaService.cargarLogo(this.empresa_id, event).subscribe({
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
    this.empresaService
      .eliminarLogoEmpresa(this.empresa_id)
      .pipe(switchMap((respuestaEliminarLogoEmpresa) => {
        if(respuestaEliminarLogoEmpresa.limpiar){
          this.consultarDetalle()
        }
         return of(null)
      }))
      .subscribe();
  }
}
