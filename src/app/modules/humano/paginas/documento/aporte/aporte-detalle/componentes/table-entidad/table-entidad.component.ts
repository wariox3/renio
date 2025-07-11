import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { RespuestaAporteDetalle } from '@modulos/humano/interfaces/respuesta-aporte-detalle';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { TablaEntidadService } from '../../services/tabla-entidad.service';
import { PaginadorComponent } from "@comun/componentes/ui/tabla/paginador/paginador.component";

@Component({
  selector: 'app-table-entidad',
  standalone: true,
  imports: [
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
    NgbTooltipModule,
    PaginadorComponent
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
  arrParametrosConsulta = signal<ParametrosApi>({
    limit: 50,
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

  cambiarPaginacion(page: number) {
    this._tableEntidadService.actualizarPaginacion(page);
    this.consultarDatos();
  }

  descargarExcelDetalle() {
    const params = {
      ...this.parametrosConsulta,
      serializador: 'informe_aporte_entidad',
      excel_informe: 'True',
      limite: 10000,
    };

    this._descargarArchivosService.exportarExcel('humano/aporte_entidad', params);
    this.dropdown.close();
  }
}
