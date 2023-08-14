import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-comun-productos',
  standalone: true,
  imports: [
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent extends General {
  itemSeleccionado: Item | null = null;
  arrItemsLista: Item[];
  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {
    super();
  }

  agregarItem(item: Item) {
    this.itemSeleccionado = item;
    this.changeDetectorRef.detectChanges();
    this.emitirArrItems.emit(this.itemSeleccionado);
  }

  removerItem() {
    this.itemSeleccionado = null;
    this.emitirArrItems.emit(this.itemSeleccionado);
    this.changeDetectorRef.detectChanges();
  }

  consultarItems() {
    let arrFiltros = {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Item',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .subscribe((respuesta) => {
        this.arrItemsLista = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }
}
