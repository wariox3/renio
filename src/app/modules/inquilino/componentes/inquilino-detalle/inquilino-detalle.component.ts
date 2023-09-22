import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { Inquilino } from '@interfaces/usuario/inquilino';
import { InquilinoService } from '@modulos/inquilino/servicios/inquilino.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-inquilino-detalle',
  templateUrl: './inquilino-detalle.component.html',
  styleUrls: ['./inquilino-detalle.component.scss'],
})
export class InquilinoDetalleComponent extends General implements OnInit {
  inquilino_id = this.activatedRoute.snapshot.paramMap.get('codigoinquilino')!;
  informacionEmpresa: Inquilino = {
    inquilino_id: 0,
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
    ciudad: 0,
    correo: '',
    direccion: '',
    identificacion: 0,
    nombre_corto: '',
    numero_identificacion: 0,
    telefono: '',
  };

  constructor(private inquilinoService: InquilinoService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.inquilinoService
      .consultarInformacion(this.inquilino_id)
      .subscribe((respuesta: any) => {
        this.informacionEmpresa = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  recuperarBase64(event: any) {
    this.inquilinoService.cargarLogo(this.inquilino_id, event).subscribe({
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
    this.inquilinoService
      .eliminarLogoEmpresa(this.inquilino_id)
      .pipe(
        switchMap((respuestaEliminarLogoEmpresa) => {
          if (respuestaEliminarLogoEmpresa.limpiar) {
            this.consultarDetalle();
          }
          return of(null);
        })
      )
      .subscribe();
  }
}
