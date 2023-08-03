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
    filtros: [],
    limite: 50,
    desplazar: 0,
    orden: "",
    cantidadLimite: 10000
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
    this.httpService.post<Item[]>('general/item/', this.arrFiltros).subscribe((respuesta) => {
      this.arrItems = respuesta;
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
