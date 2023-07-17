import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { obtenerImagen } from '@redux/selectors/usuario-imagen.selectors';
import { switchMap } from 'rxjs';
import { obtenerUsuarioCorreo } from '@redux/selectors/usuario-correo.selectors';
import { EmpresaService } from '../../../empresa/servicios/empresa.service';
import { Empresa } from '@interfaces/usuario/empresa';
import { General } from '@comun/clases/general';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent extends General implements OnInit {
  arrEmpresas: Empresa[] = [];
  usuarioImagen$ = this.store.select(obtenerImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioCorreo);
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  constructor(
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this.store
      .select(obtenerId)
      .pipe(switchMap((usuarioId) => this.empresaService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrEmpresas = respuesta.empresas;
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
