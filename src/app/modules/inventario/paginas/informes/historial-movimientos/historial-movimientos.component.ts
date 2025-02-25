import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { TablaComponent } from '../../../../../comun/componentes/tabla/tabla.component';
import { ExistenciaService } from './services/historial-movimientos.service';

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
    BaseFiltroComponent,
    TablaComponent,
  ],
})
export default class HistorialMovimientosComponent extends General implements OnInit {
  private readonly _existenciaService = inject(ExistenciaService);

  public itemsLista = this._existenciaService.contabilizarLista;
  public cantidadRegistros = this._existenciaService.cantidadRegistros;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();

    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = parametro.itemNombre!;
    });

    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['historial_movimientos'] }),
    );
  }

  consultarLista() {
    this._existenciaService.consultarListaContabilizar().subscribe();
  }

  obtenerFiltros(filtros: Filtros[]) {
    this._existenciaService.aplicarFiltros(filtros);
    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._existenciaService.actualizarPaginacion(data);
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this._existenciaService.cambiarDesplazamiento(desplazamiento);
    this.consultarLista();
  }

  cambiarOrdemiento(ordenamiento: string) {
    this._existenciaService.actualizarOrdenamiento(ordenamiento)
    this.consultarLista();
  }
}
