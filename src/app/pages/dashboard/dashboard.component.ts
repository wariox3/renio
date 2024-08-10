import { InicioHumanoComponent } from './../../modules/humano/componentes/inicio/inicio-humano/inicio-humano.component';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { LaboratorioComponent } from '../../comun/componentes/laboratorio/laboratorio.component';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { zip } from 'rxjs';
import { dashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { InicioContabilidadComponent } from '@modulos/contabilidad/componentes/inicio/inicio-contabilida.component';
import { InicioCompraComponent } from '@modulos/compra/componentes/inicio/inicio-compra/inicio-compra.component';
import { InicioVentaComponent } from '@modulos/venta/componentes/inicio/inicio-venta/inicio-venta.component';
import { InicioTesoreriaComponent } from '@modulos/tesoreria/componentes/inicio/inicio-tesoreria/inicio-tesoreria.component';
import { InicioInventarioComponent } from '@modulos/inventario/componentes/inicio/inicio-inventario/inicio-inventario.component';
import { InicioCarteraComponent } from '@modulos/cartera/componentes/inicio/inicio-cartera/inicio-cartera.component';
import { InicioGeneralComponent } from '@modulos/general/componentes/inicio/inicio-general/inicio-general.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    RouterModule,
    NgbTooltipModule,
    LaboratorioComponent,
    NgApexchartsModule,
    CommonModule,
    InicioContabilidadComponent,
    InicioCompraComponent,
    InicioVentaComponent,
    InicioTesoreriaComponent,
    InicioInventarioComponent,
    InicioHumanoComponent,
    InicioCarteraComponent,
    InicioGeneralComponent,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class DashboardComponent extends General implements OnInit {

  ruta = localStorage.getItem('ruta')!;
  asistente_electronico: boolean;
  arrResumenCobrar: any;
  arrResumenPagar: any;
  arrVentaDiaria: any;
  series: any = [];
  dates: any = [];

  constructor(
    private httpService: HttpService,
    private empresaService: EmpresaService,
    private dashboardService: dashboardService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.consultarInformacionDashboard();
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

  consultarInformacionDashboard() {
    zip(
      this.dashboardService.resumenCobrar(''),
      this.dashboardService.resumenPagar('')
    ).subscribe((respuesta: any) => {
      this.arrResumenCobrar = respuesta[0];
      this.arrResumenPagar = respuesta[1];
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
      this.consultarInformacion();
    });
  }

}
