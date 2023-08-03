import { Component, OnInit } from '@angular/core';
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
  cantidad_registros: number = 0;
  arrEncabezado: string[] = this.itemService.arrEncabezado();
  filtros: Listafiltros[] = this.itemService.estructuraFiltrosLista();

  arrFiltros: any = {
    filtros: [
      {
        "propiedad": "Texto",
        "operador": "diferente",
        "valor1": "15",
        "valor2": ""
    }
    ],
    limite: 50,
    desplazar: 0,
    orden: "",
    limite_conteo: 10000
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
    console.log(this.arrFiltros);

    this.httpService.post<{cantidad_registros: number, registros: Item[]}>('general/item/lista/', this.arrFiltros).subscribe((respuesta) => {
      this.cantidad_registros = respuesta.cantidad_registros
      this.arrItems = respuesta.registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  obtenerFiltros(arrfiltros: any) {
    this.arrFiltros.filtros = arrfiltros
    this.consultarLista();
  }

  detalle(item: Item) {
    this.router.navigate(['/general/administracion/item/detalle', 3]);
  }

  editar(item: Item) {
    this.router.navigate(['/general/administracion/item/editar', 3]);
  }

  cantidadRegistros(cantidad: number) {
    this.arrFiltros.cantidad = cantidad;
    this.consultarLista();
  }
}
