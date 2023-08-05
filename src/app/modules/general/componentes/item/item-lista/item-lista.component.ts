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
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
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

  cantidadRegistros(limite: number) {
    this.arrFiltros.limite = limite;
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento : number) {
    this.arrFiltros.desplazar = desplazamiento;
    this.consultarLista();
  }

  cambiarOrdemiento(ordenamiento: string){
    this.arrFiltros.ordenamientos[0] = ordenamiento,
    this.consultarLista();
  }

  cambiarPaginacion(data:{desplazamiento:number, limite:number}){
    this.arrFiltros.limite = data.desplazamiento;
    this.arrFiltros.desplazamiento = data.limite;
    this.consultarLista();
    console.log(this.arrFiltros);
       
  }
}
