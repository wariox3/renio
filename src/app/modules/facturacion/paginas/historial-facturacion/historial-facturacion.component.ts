import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';
import { Movimiento } from '@interfaces/facturacion/Facturacion';
import { TranslateModule } from '@ngx-translate/core';
import { HttpService } from '@comun/services/http.service';
import { NgbTooltipModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { VerConsumoUsuarioComponent } from '../../components/ver-consumo-usuario/ver-consumo-usuario.component';

@Component({
  selector: 'app-historial-facturacion',
  standalone: true,
  templateUrl: './historial-facturacion.component.html',
  styleUrls: ['./historial-facturacion.component.scss'],
  imports: [CommonModule, TranslateModule, NgbTooltipModule, PaginadorComponent, VerConsumoUsuarioComponent],
})
export class HistorialFacturacionComponent extends General implements OnInit {
  movientos: Movimiento[];
  currentPage = signal<number>(1);
  totalItems: number = 0;
  usuarioId: number;
  movimientoSeleccionado = signal<any>({});

  constructor(
    private contenedorService: ContenedorService, 
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
        {
          this.usuarioId = respuestaUsuarioId;
          return this.contenedorService.consultaUsuario(respuestaUsuarioId)
        }
        ),
        tap((respuestaConsultaUsuario) => {
          this.movientos = respuestaConsultaUsuario.movimientos;
          this.totalItems = respuestaConsultaUsuario.movimientos?.length || 0;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }


  descargarDocumento(documento_id:any) {
    this.httpService.descargarArchivoDominio('contenedor/movimiento/descargar/', {
      'id': documento_id
    });
  }

  consultarMovimientos(usuarioId: number) {
    this.contenedorService.consultaUsuario(usuarioId).subscribe((respuestaConsultaUsuario) => {
      this.movientos = respuestaConsultaUsuario.movimientos;
      this.totalItems = respuestaConsultaUsuario.movimientos?.length || 0;
      this.changeDetectorRef.detectChanges();
    });
  }

  cambiarPaginacion(page: number) {
    this.currentPage.set(page);
    this.consultarMovimientos(this.usuarioId);
  }

  abrirModal(content: any, movimiento: any) {
    this.movimientoSeleccionado.set(movimiento);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    });
  }
}
