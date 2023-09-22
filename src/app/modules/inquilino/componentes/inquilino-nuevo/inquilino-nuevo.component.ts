import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InquilinoService } from '../../servicios/inquilino.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';
import { General } from '@comun/clases/general';
import { Inquilino, InquilinoFormulario } from '@interfaces/usuario/inquilino';

@Component({
  selector: 'app-inquilino-nuevo',
  templateUrl: './inquilino-nuevo.component.html',
  styleUrls: ['./inquilino-nuevo.component.scss'],
})
export class InquilinoNuevoComponent extends General implements OnInit {
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  informacionInquilino: InquilinoFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };

  constructor(private inquilinoService: InquilinoService) {
    super();
  }

  ngOnInit(): void {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario(dataFormularioLogin: InquilinoFormulario) {
    this.visualizarBtnAtras = false;
    this.procesando = true;

    this.inquilinoService
    .consultarNombre(dataFormularioLogin.subdominio)
    .pipe(
      tap((respuesta: any) => {
        if (respuesta && respuesta.inquilino) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.EMPRESAS.NUEVAEMPRESA'
            )
          );
          this.router.navigate(['/inquilino/lista']);
          this.procesando = false;
        }
      }),
      tap({
        error: () => {
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
        },
      }),
      switchMap(({ validar }) => {
        if (!validar) {
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajeError('Error', 'Nombre en uso');
        } else {
          return this.inquilinoService.nuevo(
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
