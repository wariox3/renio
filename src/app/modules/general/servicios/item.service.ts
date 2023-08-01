import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subdomino } from '@comun/clases/subdomino';
import { Listafiltros } from '@interfaces/comunes/filtros';

@Injectable({
  providedIn: 'root'
})
export class ItemService  {


  estructuraFiltrosLista():Listafiltros[] {
    return [
      {
        tipo: 'Texto',
        valor: 'nombre',
      },
      {
        tipo: 'Texto',
        valor: 'codigo',
      },
      {
        tipo: 'Texto',
        valor: 'referencia',
      },
      {
        tipo: 'Numero',
        valor: 'costo',
      },
      {
        tipo: 'Numero',
        valor: 'precio',
      },
    ];
  }

  arrEncabezado(): string[]{
    return [
      'Nombre',
      'Codigo',
      'Referencia',
      'Costo',
      'Precio'
    ];
  }
}
