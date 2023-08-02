import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { Item } from '@modulos/general/modelos/item';
import { ItemService } from '@modulos/general/servicios/item.service';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.scss'],
})
export class ItemListaComponent extends General implements OnInit {
  arrItems: Item[] = [];
  arrEncabezado: string[] = this.itemService.arrEncabezado();

  filtros: Listafiltros[] = this.itemService.estructuraFiltrosLista();

  arrFiltros: any = {
    cantidad: 50,
  };

  constructor(
    private httpService: HttpService,
    private itemService: ItemService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    let url = 'general/item/';
    var miString = JSON.stringify(this.arrFiltros);

    // url += miString;

    this.httpService.get<Item>(url).subscribe((respuesta) => {
      this.arrItems = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  obtenerFiltros(arrfiltros: any) {
    const queryParams = arrfiltros
      .map((item: any) => {
        return Object.keys(item)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(item[key])}`
          )
          .join('&');
      })
      .join('&');
    this.consultarLista();
  }

  detalle(item: Item) {
    this.router.navigate(['/general/administracion/item/detalle', 3]);
  }

  editar(item: Item) {
    this.router.navigate(['/general/administracion/item/editar', 3]);
  }

  cantidadRegistros(cantidad: number) {
    console.log(this.arrFiltros);
    this.arrFiltros.cantidad = cantidad;
    console.log(this.arrFiltros);
    this.consultarLista();
  }
}
