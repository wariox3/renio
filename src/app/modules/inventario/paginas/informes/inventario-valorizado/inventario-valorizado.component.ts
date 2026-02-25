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
import { FiltroComponent } from "@comun/componentes/ui/tabla/filtro/filtro.component";
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { InventarioValorizadoService } from './services/inventario-valorizado.service';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './inventario-valorizado.component.html',
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
export default class InventarioValorizadoComponent extends General implements OnInit {
  private readonly _inventarioValorizadoService = inject(InventarioValorizadoService);
  private readonly _filterTransformerService = inject(FilterTransformerService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);

  public itemsLista = this._inventarioValorizadoService.contabilizarLista;
  public cantidadRegistros = this._inventarioValorizadoService.cantidadRegistros;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['inventario_valorizado'] }),
    );
  }

  consultarLista() {
    this._inventarioValorizadoService.consultarListaContabilizar().subscribe();
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const parametros = this._filterTransformerService.transformToApiParams(filtros);
    this._inventarioValorizadoService.aplicarFiltros(parametros);
    this.consultarLista();
  }

  cambiarPaginacion(event: { desplazamiento: number; limite: number }) {
    this._inventarioValorizadoService.actualizarPaginacion(event.desplazamiento);
    this.consultarLista();
  }

  descargarExcel() {
    const parametros: ParametrosApi = {
      ...this._inventarioValorizadoService.getParametrosConsular,
      serializador: 'informe_existencia',
      excel_informe: 'True',
    }

    this._descargarArchivosService.exportarExcel(
      'general/item',
      parametros,
    );
  }
}
