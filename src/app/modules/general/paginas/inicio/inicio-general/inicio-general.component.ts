import {
  CommonModule,
  formatCurrency
} from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { RespuestaResumen } from '@modulos/general/interfaces/resumen';
import { dashboardService } from '@modulos/general/servicios/dashboard.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexNoData,
  ApexStates,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { zip } from 'rxjs';

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
  subtitle: ApexTitleSubtitle;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  states?: ApexStates;
  markers?: ApexMarkers;
  theme?: ApexTheme;
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
    vigente: {
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
    vigente: {
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
      this.dashboardService.resumenCobrar(),
      this.dashboardService.resumenPagar(),
    ).subscribe((respuesta) => {
      this.arrResumenCobrar = respuesta[0];
      this.arrResumenPagar = respuesta[1];

      // Update donut charts data
      if (this.donutChartOptions) {
        const totalCobrar = this.arrResumenCobrar.vigente.saldo_pendiente + this.arrResumenCobrar.vencido.saldo_pendiente;
        if (totalCobrar > 0) {
          this.donutChartOptions.series = [
            this.arrResumenCobrar.vigente.saldo_pendiente,
            this.arrResumenCobrar.vencido.saldo_pendiente
          ];
          this.donutChartOptions.colors = ['#50CD89', '#FF0000'];
        } else {
          this.donutChartOptions.series = [1];
          this.donutChartOptions.colors = ['#E4E6EF'];
        }
      }
      
      if (this.donutChartPagarOptions) {
        const totalPagar = this.arrResumenPagar.vigente.saldo_pendiente + this.arrResumenPagar.vencido.saldo_pendiente;
        if (totalPagar > 0) {
          this.donutChartPagarOptions.series = [
            this.arrResumenPagar.vigente.saldo_pendiente,
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
    this.dashboardService.ventaPorDia().subscribe((respuesta) => {
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
          height: 350,
          type: 'area',
          fontFamily: 'inherit',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          dropShadow: {
            enabled: true,
            top: 3,
            left: 2,
            blur: 4,
            opacity: 0.1,
          },
          background: 'transparent',
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          },
        },
        stroke: {
          curve: 'smooth',
          colors: ['#4CAF50'],
          lineCap: 'round',
          width: 4,
        },
        markers: {
          size: 5,
          colors: ['#FFFFFF'],
          strokeColors: '#4CAF50',
          strokeWidth: 2,
          hover: {
            size: 7,
          }
        },
        title: {
          text: 'Ventas por día',
          align: 'left',
          offsetX: 5,
          style: {
            color: '#333',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'inherit',
          },
        },
        subtitle: {
          text: 'La gráfica muestra el valor de tus ventas',
          align: 'left',
          offsetX: 5,
          style: {
            color: '#666',
            fontSize: '14px',
            fontFamily: 'inherit',
          },
        },
        grid: {
          borderColor: '#e0e0e0',
          strokeDashArray: 3,
          position: 'back',
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },
          row: {
            opacity: 0.5,
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 10
          },
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '12px',
            fontFamily: 'inherit',
          },
          y: {
            formatter: (value: number) => {
              return formatCurrency(value, 'en-US', '$', 'COP', '1.0-0')!;
            }
          },
          marker: {
            show: true,
            fillColors: ['#4CAF50'],
          },
          fixed: {
            enabled: false,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
          },
        },
        xaxis: {
          categories: this.dates,
          labels: {
            style: {
              colors: '#666',
              fontSize: '12px',
              fontFamily: 'inherit',
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            show: true,
            position: 'back',
            stroke: {
              color: '#b6b6b6',
              width: 1,
              dashArray: 3,
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (value: number) => {
              return formatCurrency(value, 'en-US', '$', 'COP', '1.0-0')!;
            },
            style: {
              colors: '#666',
              fontSize: '12px',
              fontFamily: 'inherit',
            },
          },
          forceNiceScale: true,
          tickAmount: 5,
          min: 0,
        },
        states: {
          normal: {
            filter: {
              type: 'none',
            }
          },
          hover: {
            filter: {
              type: 'lighten',
              value: 0.1,
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'darken',
              value: 0.15,
            }
          },
        },
        noData: {
          text: 'No hay datos disponibles',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#666',
            fontSize: '14px',
            fontFamily: 'inherit'
          }
        },
      };

      this.chartOptions.series = [
        {
          name: 'Ventas',
          data: this.series,
        },
      ];
      this.changeDetectorRef.detectChanges();
    });
  }
}
