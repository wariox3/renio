import { environment } from 'src/environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioUserName,
} from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';
import { ContenedorService } from '../../../contenedor/servicios/contenedor.service';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { General } from '@comun/clases/general';
import { SkeletonLoadingComponent } from '../../../../comun/componentes/skeleton-loading/skeleton-loading.component';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    standalone: true,
    imports: [
        TranslateModule,
        NgIf,
        NgFor,
        NgOptimizedImage,
        SkeletonLoadingComponent,
    ],
})
export class OverviewComponent extends General implements OnInit {
  arrContenedores: Contenedor[] = [];
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioUserName);
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  dominioApp = environment.dominioApp
  cargandoContederes = false;

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this.cargandoContederes = true;
    this.changeDetectorRef.detectChanges()
    this.store
      .select(obtenerUsuarioId)
      .pipe(switchMap((usuarioId) => this.contenedorService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrContenedores = respuesta.contenedores;
          this.cargandoContederes = false;
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
}
