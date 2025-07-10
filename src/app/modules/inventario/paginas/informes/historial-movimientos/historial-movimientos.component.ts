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
import { FiltroComponent } from "../../../../../comun/componentes/ui/tabla/filtro/filtro.component";
import { ExistenciaService } from './services/historial-movimientos.service';
import { HISTORIAL_MOVIMIENTO_FILTERS } from '@modulos/inventario/domain/mapeos/historial-movimiento.mapeo';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './historial-movimientos.component.html',
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
export default class HistorialMovimientosComponent extends General implements OnInit {
  private readonly _existenciaService = inject(ExistenciaService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  public itemsLista = this._existenciaService.contabilizarLista;
  public cantidadRegistros = this._existenciaService.cantidadRegistros;
  public CAMPOS_FILTRO = HISTORIAL_MOVIMIENTO_FILTERS;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['historial_movimientos'] }),
    );
  }

  consultarLista() {
    this._existenciaService.consultarListaContabilizar().subscribe();
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const apiParams = this._filterTransformerService.transformToApiParams(filtros);
    this._existenciaService.aplicarFiltros(apiParams);
    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._existenciaService.actualizarPaginacion(data.desplazamiento);
    this.consultarLista();
  }
}
