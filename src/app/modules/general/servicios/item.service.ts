import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subdomino } from '@comun/clases/subdomino';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends Subdomino {

  constructor(private http: HttpClient) {
    super()
  }

  lista() {
    return this.http.get(`${this.urlSubDominio}/general/item/`);
  }
}
