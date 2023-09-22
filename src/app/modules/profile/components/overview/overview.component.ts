import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioNombre,
} from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';
import { ContenedorService } from '../../../contenedor/servicios/contenedor.service';
import { Contenedor } from '@interfaces/usuario/contenedor';
import { General } from '@comun/clases/general';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent extends General implements OnInit {
  arrContenedores: Contenedor[] = [];
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(switchMap((usuarioId) => this.contenedorService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrContenedores = respuesta.contenedores;
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
