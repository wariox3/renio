import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { TablaComponent } from '../../../../../comun/componentes/tabla/tabla.component';
import { ExistenciaService } from './services/existencia.service';
import { FiltroComponent } from "@comun/componentes/ui/tabla/filtro/filtro.component";
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { EXISTENCIA_FILTERS } from '@modulos/inventario/domain/mapeos/existencia.mapeo';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './existencia.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    TablaComponent,
    FiltroComponent
],
})
export default class ExistenciaComponent extends General implements OnInit {
  private readonly _existenciaService = inject(ExistenciaService);
  private readonly _filterTransformerService = inject(FilterTransformerService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);

  public itemsLista = this._existenciaService.contabilizarLista;
  public cantidadRegistros = this._existenciaService.cantidadRegistros;
  public availableFields = EXISTENCIA_FILTERS;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['existencia'] }),
    );
  }

  consultarLista() {
    this._existenciaService.consultarListaContabilizar().subscribe();
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const parametros = this._filterTransformerService.transformToApiParams(filtros);
    this._existenciaService.aplicarFiltros(parametros);
    this.consultarLista();
  }

  cambiarPaginacion(event: { desplazamiento: number; limite: number }) {
    this._existenciaService.actualizarPaginacion(event.desplazamiento);
    this.consultarLista();
  }

  descargarExcel() {
    const parametros: ParametrosApi = {
      ...this._existenciaService.getParametrosConsular,
      serializador: 'informe_existencia',
      excel_informe: 'True',
    }

    this._descargarArchivosService.exportarExcel(
      'general/item',
      parametros,
    );
  }
}
