import {
  CommonModule,
  formatCurrency,
  getCurrencySymbol,
} from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexLegend
} from 'ng-apexcharts';
import { zip } from 'rxjs';
import { dashboardService } from '@modulos/general/servicios/dashboard.service';
import { RespuestaResumen } from '@modulos/general/interfaces/resumen';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  noData: ApexNoData;
};

@Component({
  selector: 'app-inicio-general',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './inicio-general.component.html',
  styleUrl: './inicio-general.component.scss',
})
export class InicioGeneralComponent extends General implements OnInit {
  @ViewChild('donutChart') donutChart: ChartComponent;
  @ViewChild('donutChartPagar') donutChartPagar: ChartComponent;
  public donutChartOptions: any;
  public donutChartPagarOptions: any;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  ruta = localStorage.getItem('ruta')!;
  arrVentaDiaria: any;
  arrResumenCobrar: RespuestaResumen = {
    resumen: {
      cantidad: 0,
      saldo_pendiente: 0,
    },
    vencido: {
      cantidad: 0,
      saldo_pendiente: 0,
    },
  };
  arrResumenPagar: RespuestaResumen = {
    resumen: {
      cantidad: 0,
      saldo_pendiente: 0,
    },
    vencido: {
      cantidad: 0,
      saldo_pendiente: 0,
    },
  };
  series: any = [];
  dates: any = [];

  constructor(private dashboardService: dashboardService) {
    super();
  }

  ngOnInit() {
    this.initializeChart();
    this.initializeDonutChart();
    this.initializeDonutChartPagar();
    this.consultarInformacionDashboard();
  }

  initializeDonutChartPagar() {
    this.donutChartPagarOptions = {
      series: [1],
      chart: {
        type: 'donut',
        height: 70,
        width: 70,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#E4E6EF'],
      stroke: {
        width: 2
      },
      tooltip: {
        enabled: false
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%'
          }
        }
      }
    };
  }

  initializeDonutChart() {
    this.donutChartOptions = {
      series: [1],
      chart: {
        type: 'donut',
        height: 70,
        width: 70,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#E4E6EF'],
      stroke: {
        width: 2
      },
      tooltip: {
        enabled: false
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%'
          }
        }
      }
    };
  }

  consultarInformacionDashboard() {
    zip(
      this.dashboardService.resumenCobrar(''),
      this.dashboardService.resumenPagar(''),
    ).subscribe((respuesta) => {
      this.arrResumenCobrar = respuesta[0];
      this.arrResumenPagar = respuesta[1];

      // Update donut charts data
      if (this.donutChartOptions) {
        const totalCobrar = this.arrResumenCobrar.resumen.saldo_pendiente + this.arrResumenCobrar.vencido.saldo_pendiente;
        if (totalCobrar > 0) {
          this.donutChartOptions.series = [
            this.arrResumenCobrar.resumen.saldo_pendiente,
            this.arrResumenCobrar.vencido.saldo_pendiente
          ];
          this.donutChartOptions.colors = ['#50CD89', '#FF0000'];
        } else {
          this.donutChartOptions.series = [1];
          this.donutChartOptions.colors = ['#E4E6EF'];
        }
      }
      
      if (this.donutChartPagarOptions) {
        const totalPagar = this.arrResumenPagar.resumen.saldo_pendiente + this.arrResumenPagar.vencido.saldo_pendiente;
        if (totalPagar > 0) {
          this.donutChartPagarOptions.series = [
            this.arrResumenPagar.resumen.saldo_pendiente,
            this.arrResumenPagar.vencido.saldo_pendiente
          ];
          this.donutChartPagarOptions.colors = ['#50CD89', '#FF0000'];
        } else {
          this.donutChartPagarOptions.series = [1];
          this.donutChartPagarOptions.colors = ['#E4E6EF'];
        }
      }
      
      this.changeDetectorRef.detectChanges();
    });
  }

  initializeChart() {
    this.dashboardService.ventaPorDia('').subscribe((respuesta) => {
      this.arrVentaDiaria = respuesta.resumen;

      this.dates = this.arrVentaDiaria.map(
        (item: any) => item.dia.split('-')[2],
      );
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
          text: 'La gráfica muestra el valor de tus ventas con impuestos incluidos',
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
        yaxis: {
          labels: {
            formatter: (value: number) => {
              return formatCurrency(value, 'en-US', '$', 'COP', '1.0-0')!;
            },
          },
          forceNiceScale: true,
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
