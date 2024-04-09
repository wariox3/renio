import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';
import { Contenedor  } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { of, switchMap } from 'rxjs';
import { ExtrasModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ContenedorEditarComponent } from '../contenedor-editar/contenedor-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contenedor-detalle',
  templateUrl: './contenedor-detalle.component.html',
  styleUrls: ['./contenedor-detalle.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    TranslationModule,
    CardComponent,
    CargarImagenComponent,
    ExtrasModule,
    SharedModule,
    ContenedorEditarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule
  ],
  providers: [NgbActiveModal],

})
export class ContenedorDetalleComponent extends General implements OnInit {
  contenedor_id = this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
  informacionEmpresa: any = {
    contenedor_id: 0,
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

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .subscribe((respuesta: any) => {
        this.informacionEmpresa = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  recuperarBase64(event: any) {
    this.contenedorService.cargarLogo(this.contenedor_id, event).subscribe({
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
    this.contenedorService
      .eliminarLogoEmpresa(this.contenedor_id)
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
