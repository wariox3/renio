import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { ProgramacionService } from '@modulos/humano/servicios/programacion';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-programacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule
  ],
  templateUrl: './programacion-detalle.component.html',
  styleUrl: './programacion-detalle.component.scss',
})
export default class ProgramacionDetalleComponent extends General implements OnInit {
  active: Number;
  
  programacion: any = {
    id: 0,
    fecha_desde: "",
    fecha_hasta: "",
    fecha_hasta_periodo: "",
    nombre: "",
    cantidad: 0,
    dias: 0,
    descuento_pension: false,
    descuento_salud: false,
    descuento_fondo_solidaridad: false,
    descuento_adicional_permanente: false,
    descuento_adicional_programacion: false,
    descuento_credito: false,
    descuento_embargo: false,
    descuento_retencion_fuente: false,
    pago_auxilio_transporte: false,
    pago_horas: false,
    pago_incapacidad: false,
    pago_licencia: false,
    pago_vacacion: false,
  };

  arrEstados = {
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
  };

  arrParametrosConsulta: any;
  arrParametrosConsultaAdicional: any;
  arrProgramacionDetalle: any;
  arrProgramacionAdicional: any;

  constructor(
    private programacionService: ProgramacionService,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarDatos();
  }

  consultarDatos() {
    this.programacionService.consultarDetalle(this.detalle).subscribe((respuesta: any) => {
      this.programacion = respuesta;
      this.inicializarParametrosConsulta();
      this.inicializarParametrosConsultaAdicional();
      forkJoin({
        programacionDetalles: this.httpService.post('general/funcionalidad/lista/', this.arrParametrosConsulta),
        programacionAdicionales: this.httpService.post('general/funcionalidad/lista/', this.arrParametrosConsultaAdicional)
      }).subscribe(({ programacionDetalles, programacionAdicionales }: any) => {
        this.arrProgramacionDetalle = programacionDetalles.registros;
        this.arrProgramacionAdicional = programacionAdicionales.registros
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    };
  }

  inicializarParametrosConsultaAdicional() {
    this.arrParametrosConsultaAdicional = {
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    };
  }

  cargarContratos() {
    this.programacionService.cargarContratos({
      id: this.programacion.id
    }).subscribe();
    this.consultarDatos()
  }

  generar() {
    this.programacionService.generar({
      id: this.programacion.id
    }).subscribe();
    this.consultarDatos()
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }
}

