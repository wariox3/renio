import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { CardComponent } from "../../comun/componentes/card/card.component";
import { RouterModule } from '@angular/router';
import { Empresa } from '@interfaces/contenedor/empresa';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [CardComponent, RouterModule]
})
export class DashboardComponent extends General implements OnInit {
  constructor(private httpService: HttpService) {
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
        this.asistente_electronico = empresa.asistente_electronico
        this.store.dispatch(empresaActionInit({ empresa }));
        this.changeDetectorRef.detectChanges();
      });
  }
}
