import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subdomino } from '@comun/services/subdomino';
import { Item } from '../modelos/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService extends Subdomino {

  constructor(private http: HttpClient) {
    super();
  }

  lista(){
    return this.http.get<Item[]>(`${this.urlSubDominio}/general/item/`);
  }

  nuevo(nombre: string){
    return this.http.post<Item[]>(`${this.urlSubDominio}/general/item/`, {nombre});

  }
}
