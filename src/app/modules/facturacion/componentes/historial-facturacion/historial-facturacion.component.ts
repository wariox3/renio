import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';
import { Movimiento } from '@interfaces/facturacion/Facturacion';
import { TranslateModule } from '@ngx-translate/core';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-historial-facturacion',
  standalone: true,
  templateUrl: './historial-facturacion.component.html',
  styleUrls: ['./historial-facturacion.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class HistorialFacturacionComponent extends General implements OnInit {
  movientos: Movimiento[];

  constructor(private contenedorService: ContenedorService, private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.consultaUsuario(respuestaUsuarioId)
        ),
        tap((respuestaConsultaUsuario) => {
          this.movientos = respuestaConsultaUsuario.movimientos;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }


  descargarDocumento(documento_id:any) {
    this.httpService.descargarArchivo('contenedor/movimiento/descargar/', {
      'id': documento_id
    });
  }
}
