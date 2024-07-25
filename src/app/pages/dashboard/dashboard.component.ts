import { Component, OnInit, ViewChild } from '@angular/core';
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
import { LaboratorioComponent } from "../../comun/componentes/laboratorio/laboratorio.component";
import { series } from "../../comun/componentes/laboratorio/data";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CardComponent, RouterModule, NgbTooltipModule, LaboratorioComponent, NgApexchartsModule],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})

export class DashboardComponent extends General implements OnInit {
  constructor(
    private httpService: HttpService,
    private empresaService: EmpresaService,
    
  ) {
    super();

    this.areaChartOptions = {
      series: [
        {
          name: "Total",
          data: series.monthDataSeries1.prices
        }
      ],
      chart: {
        type: "area",
        height: 450,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Análisis fundamental de las acciones",
        align: "left"
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  @ViewChild('seires') seiresChart: ChartComponent;
  public areaChartOptions: Partial<areaChartOptions>;

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
