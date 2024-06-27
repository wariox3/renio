import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { CardComponent } from "../../comun/componentes/card/card.component";
import { RouterModule } from '@angular/router';

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

  rededoc_id: string | null;

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.httpService
      .getDetalle<any>(`general/empresa/1/`)
      .subscribe((empresa: any) => {
        this.rededoc_id = empresa.rededoc_id
        this.store.dispatch(empresaActionInit({ empresa }));
        this.changeDetectorRef.detectChanges();
      });
  }
}
