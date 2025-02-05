import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { RespuestaAporteDetalle } from '@modulos/humano/interfaces/respuesta-aporte-detalle';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PaginadorComponent } from '../../../../../../../../comun/componentes/paginador/paginador.component';
import { TablaEntidadService } from '../../services/tabla-entidad.service';

@Component({
  selector: 'app-table-entidad',
  standalone: true,
  imports: [
    PaginadorComponent,
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
    NgbTooltipModule,
  ],
  templateUrl: './table-entidad.component.html',
})
export class TableEntidadComponent extends General implements OnInit {
  private readonly _tableEntidadService = inject(TablaEntidadService);
  private _descargarArchivosService = inject(DescargarArchivosService);

  public entidadesAgrupadas =
    this._tableEntidadService.aporteEntidadListaAgrupada;
  public totalGeneral = this._tableEntidadService.totalGeneral;
  public cantidadRegistros = this._tableEntidadService.cantidadRegistros;
  public parametrosConsulta = this._tableEntidadService.getParametrosConsular;
  cargandoContratos = signal(false);
  arrParametrosConsulta = signal<ParametrosFiltros>({
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'HumAporteDetalle',
    filtros: [],
  });
  arrAporteDetalle = signal<RespuestaAporteDetalle[]>([]);

  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
  }

  consultarDatos() {
    this._tableEntidadService.consultarListaEntidades().subscribe();
  }

  inicializarParametrosConsulta() {
    this._tableEntidadService.inicializarParametros(this.detalle);
  }

  obtenerFiltros(data: any[]) {
    this.inicializarParametrosConsulta();
    if (data.length > 0) {
      this._tableEntidadService.actualizarFiltrosParametros(data);
    } else {
      this.inicializarParametrosConsulta();
    }
    this.consultarDatos();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this._tableEntidadService.cambiarDesplazamiento(desplazamiento);
    this.consultarDatos();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._tableEntidadService.actualizarPaginacion(data);
    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const modelo = 'HumAporteEntidad';
    const params = {
      modelo,
      serializador: 'Excel',
      excel: true,
      limite: 10000,
      ...this.parametrosConsulta.filtros,
    };

    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
  }
}
