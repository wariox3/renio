import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
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
import { dashboardService } from 'src/app/pages/dashboard/dashboard.service';

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
  selector: 'app-inicio-general',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
  ],
  templateUrl: './inicio-general.component.html',
  styleUrl: './inicio-general.component.scss',
})
export class InicioGeneralComponent extends General implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  ruta = localStorage.getItem('ruta')!;
  arrVentaDiaria: any;
  arrResumenCobrar: any;
  arrResumenPagar: any;
  series: any = [];
  dates: any = [];

  constructor(
    private dashboardService: dashboardService
  ) {
    super();
    this.chartOptions = {
      series: [
        {
          name: 'Total',
          data: [],
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
        categories: [],
      },
      noData: {
        text: 'no data',
      },
    };
  }

  ngOnInit() {
    this.initializeChart();
    this.consultarInformacionDashboard()
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

  initializeChart() {
    this.dashboardService.ventaPorDia('').subscribe((respuesta) => {
      this.arrVentaDiaria = respuesta.resumen;

      this.dates = this.arrVentaDiaria.map((item: any) => item.dia.split('-')[2]);
      this.series = this.arrVentaDiaria.map((item: any) => item.total);

      this.chartOptions = {
        series: [
          {
            name: 'Total',
            data: [],
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
          categories: this.dates,
        },
        noData: {
          text: 'no data',
        },
      };

      this.chartOptions.series = [
        {
          data: this.series,
        },
      ];
      this.changeDetectorRef.detectChanges();
    });
  }
}
