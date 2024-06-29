import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import {
  empresaActionInit,
  empresaActualizacionAsisteneElectronico,
} from '@redux/actions/empresa.actions';
import { CardComponent } from '../../comun/componentes/card/card.component';
import { RouterModule } from '@angular/router';
import { Empresa } from '@interfaces/contenedor/empresa';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CardComponent, RouterModule, NgbTooltipModule],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class DashboardComponent extends General implements OnInit {
  constructor(
    private httpService: HttpService,
    private empresaService: EmpresaService
  ) {
    super();
  }

  asistente_electronico: boolean;

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.httpService
      .getDetalle<Empresa>(`general/empresa/1/`)
      .subscribe((empresa) => {
        this.asistente_electronico = empresa.asistente_electronico;
        this.store.dispatch(empresaActionInit({ empresa }));
        this.changeDetectorRef.detectChanges();
      });
  }

  finalizarProceso() {
    this.empresaService.finalizarProceso().subscribe((respuesta) => {
      this.store.dispatch(
        empresaActualizacionAsisteneElectronico({
          asistente_electronico: respuesta.asistente_termiando,
        })
      );
      this.consultarInformacion()
    });
  }
}
