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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  noData: ApexNoData;
};

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
    CommonModule
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class DashboardComponent extends General implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

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
    this.chartOptions = {
      series: [
        {
          name: 'Total',
          data: []
        },
      ],
      chart: {
        height: 500,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'La gáfica muestra el valor de tus ventas con impuestos incluidos',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: []
      },
      noData:{
        text: 'no data'
      }
    };
  }

  ngOnInit() {
    this.consultarInformacion();
    this.consultarInformacionDashboard();
    this.initializeChart();

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

  initializeChart() {
    this.dashboardService.ventaPorDia('').subscribe((respuesta) => {
      
      this.arrVentaDiaria = respuesta.resumen;
      
      this.dates = this.arrVentaDiaria.map((item: any) => item.dia);
      this.series = this.arrVentaDiaria.map((item: any) => item.total);

      this.chartOptions = {
        series: [
          {
            name: 'Total',
            data: []
          },
        ],
        chart: {
          height: 500,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
        },
        title: {
          text: 'La gáfica muestra el valor de tus ventas con impuestos incluidos',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.dates
        },
        noData:{
          text: 'no data'
        }
      };
     
      this.chartOptions.series = [{
        data: this.series
      }];
      this.changeDetectorRef.detectChanges();
    });

  }


}
