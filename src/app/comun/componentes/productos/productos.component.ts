import { Component, ElementRef, ViewChild,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule, } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-comun-productos',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent extends General {
  arrItemsSeleccionados: Item[] = [];
  arrItemsLista: Item[];

  constructor(private httpService: HttpService) {
    super();
  }

  agregarItem(item: Item) {
    this.arrItemsSeleccionados.push(item);
    this.changeDetectorRef.detectChanges();
  }

  removerItem(id: string) {
    this.arrItemsSeleccionados = this.arrItemsSeleccionados.filter((index:Item)=>index.nombre !== id)
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
    };;

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
