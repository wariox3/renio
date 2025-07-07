import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AuthService } from '@modulos/auth';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { ConsultaCredito } from '@modulos/socio/interfaces/socio.interface';
import {
  NgbActiveModal,
  NgbModalModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  obtenerUsuarioId,
  obtenerUsuarioSocioId,
  obtenerUsuarioVrcredito,
} from '@redux/selectors/usuario.selectors';
import { CountUpModule } from 'ngx-countup';
import { zip } from 'rxjs';

@Component({
  selector: 'app-socio',
  standalone: true,
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    NgbNavModule,
    NgbModalModule,
    TranslateModule,
    CountUpModule,
  ],
  providers: [NgbActiveModal],
})
export class SocioComponent extends General implements OnInit {
  codigoUsuarioSocioId = '';
  vrCredito = signal(0);
  arrMovimientos: ConsultaCredito[] = [];
  arrListaSocio: any;
  active: number = 1;

  constructor(
    private contenedorServices: ContenedorService,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    this.store.select(obtenerUsuarioSocioId).subscribe((codigoUsuarioSocio) => {
      this.codigoUsuarioSocioId = codigoUsuarioSocio;
    });
    this.store
      .select(obtenerUsuarioVrcredito)
      .subscribe((credito) => this.vrCredito.set(credito));
    this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    zip(
      this.contenedorServices.consultarMovimientoSocio(
        this.codigoUsuarioSocioId,
      ),
      this.authService.listaSocio(this.codigoUsuarioSocioId),
    ).subscribe((respuesta: any) => {
      this.arrMovimientos = respuesta[0].movimientos;
      this.arrListaSocio = respuesta[1].usuarios;
      this.changeDetectorRef.detectChanges();
    });
  }
}
