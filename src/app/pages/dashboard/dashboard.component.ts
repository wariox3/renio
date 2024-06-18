import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { empresaActionInit } from '@redux/actions/empresa.actions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
})
export class DashboardComponent extends General implements OnInit {
  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.httpService
      .getDetalle<any>(`general/empresa/1/`)
      .subscribe((empresa: any) => {
        this.store.dispatch(empresaActionInit({ empresa }));
        this.changeDetectorRef.detectChanges();
      });
  }
}
