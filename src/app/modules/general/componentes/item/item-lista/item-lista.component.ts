import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.scss'],
})
export class ItemListaComponent extends General implements OnInit {
  arrItems: Item[] = [];
  arrEncabezado: string[] = ['nombre'];

  filtros: Listafiltros[] = [
    {
      tipo: 'Texto',
      valor: 'nombre',
    },
    {
      tipo: 'Numero',
      valor: 'edad',
    },
    {
      tipo: 'Booleano',
      valor: 'esActivo',
    },
    {
      tipo: 'Fecha',
      valor: 'fecha',
    },
  ];

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista(null);
  }

  consultarLista(queryParams: string | null): void {
    let url = 'general/item/';
    if (queryParams) {
      url = 'general/item/' + queryParams;
    }
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
    this.consultarLista(queryParams);
  }

  detalle(item: Item) {
    this.router.navigate(['/general/administracion/item/detalle', 3]);
  }

  editar(item: Item) {
    this.router.navigate(['/general/administracion/item/editar', 3]);
  }
}
