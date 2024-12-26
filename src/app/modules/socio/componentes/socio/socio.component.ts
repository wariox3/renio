import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AuthService } from '@modulos/auth';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbActiveModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId, obtenerUsuarioSocioId } from '@redux/selectors/usuario.selectors';
import { zip } from 'rxjs';

@Component({
  selector: 'app-socio',
  standalone: true,
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardComponent, NgbNavModule, NgbModalModule, TranslateModule],
  providers: [NgbActiveModal],
})
export class SocioComponent extends General implements OnInit {
  codigoUsuarioSocioId = '';
  arrMovimientos:any
  arrListaSocio:any
  active: number = 1;

  constructor(private contenedorServices: ContenedorService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.store.select(obtenerUsuarioSocioId).subscribe((codigoUsuarioSocio) => {
      this.codigoUsuarioSocioId = codigoUsuarioSocio;
    });
    this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {

    zip(
      this.contenedorServices.consultarMovimientoSocio(this.codigoUsuarioSocioId),
      this.authService.listaSocio(this.codigoUsuarioSocioId),
    ).subscribe((respuesta:any) => {
      this.arrMovimientos = respuesta[0].movimientos;
      this.arrListaSocio = respuesta[1].usuarios;
      this.changeDetectorRef.detectChanges();
    });
  }
}
