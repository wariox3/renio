import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Contacto } from '../modelos/contacto';
import { Subdomino } from '@comun/clases/subdomino';

@Injectable({
  providedIn: 'root'
})
export class ContactoService extends Subdomino {

  constructor(private http: HttpClient, private store: Store) {
    super()
  }

  lista() {
    return this.http.get<Contacto[]>(`${this.urlSubDominio}/general/contacto/`);
  }
}


