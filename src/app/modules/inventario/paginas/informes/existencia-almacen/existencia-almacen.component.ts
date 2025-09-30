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
import { ExistenciaAlmacenService } from './services/existencia-almacen.service';

@Component({
  selector: 'app-existencia-almacen',
  standalone: true,
  templateUrl: './existencia-almacen.component.html',
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
export default class ExistenciaAlmacenComponent extends General implements OnInit {
  private readonly _existenciaAlmacenService = inject(ExistenciaAlmacenService);
  private readonly _filterTransformerService = inject(FilterTransformerService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);

  public itemsLista = this._existenciaAlmacenService.contabilizarLista;
  public cantidadRegistros = this._existenciaAlmacenService.cantidadRegistros;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['existencia_almacen'] }),
    );
  }

  consultarLista() {
    this._existenciaAlmacenService.consultarListaContabilizar().subscribe();
  }

  obtenerFiltros(filtros: FilterCondition[]) {
    const parametros = this._filterTransformerService.transformToApiParams(filtros);
    this._existenciaAlmacenService.aplicarFiltros(parametros);
    this.consultarLista();
  }

  cambiarPaginacion(page: number) {
    this._existenciaAlmacenService.actualizarPaginacion(page);
    this.consultarLista();
  }

  descargarExcel() {
    const parametros: ParametrosApi = {
      ...this._existenciaAlmacenService.getParametrosConsular,
      serializador: 'informe_existencia',
      excel_informe: 'True',
    }

    this._descargarArchivosService.exportarExcel(
      'inventario/existencia',
      parametros,
    );
  }
}
