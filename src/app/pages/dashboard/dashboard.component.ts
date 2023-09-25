import { Component, OnInit, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Empresa } from '@interfaces/contenedor/empresa';
import { Store } from '@ngrx/store';
import { empresaActionInit } from '@redux/actions/empresa.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends General implements OnInit {

  constructor(private httpService: HttpService) {
    super()
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.httpService
      .get<any>(`general/empresa/1/`)
      .subscribe((empresa: any) => {

        this.store.dispatch(
          empresaActionInit({empresa})
        );
        this.changeDetectorRef.detectChanges()
      });
  }
}
