import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';
import { General } from '@comun/clases/general';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';

@Component({
  selector: 'app-contenedor-nuevo',
  templateUrl: './contenedor-nuevo.component.html',
  styleUrls: ['./contenedor-nuevo.component.scss'],
})
export class ContenedorNuevoComponent extends General implements OnInit {
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  informacionContenedor: ContenedorFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit(): void {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario(dataFormularioLogin: ContenedorFormulario) {
    this.visualizarBtnAtras = false;
    this.procesando = true;

    this.contenedorService
    .consultarNombre(dataFormularioLogin.subdominio)
    .pipe(
      tap((respuesta: any) => {
        if (respuesta && respuesta.contenedor) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.CONTENEDOR.NUEVAEMPRESA'
            )
          );
          this.router.navigate(['/contenedor/lista']);
        }
        this.procesando = false;
        this.changeDetectorRef.detectChanges();
      }),
      switchMap(({ validar }) => {
        if (!validar) {
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajeError('Error', 'Nombre en uso');
        } else {
          return this.contenedorService.nuevo(
            dataFormularioLogin,
            this.codigoUsuario
          );
        }
        return of(null);
      }),
    )
    .subscribe();
  }
}
