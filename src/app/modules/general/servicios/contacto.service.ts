import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { Contacto } from '../modelos/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  urlSubDominio: string = environment.URL_API_SUBDOMINIO;

  constructor(private http: HttpClient, private stores: Store) {
    // this.usuarioEmpresaNombre$.subscribe((empresaNombre) => {
      this.urlSubDominio = this.urlSubDominio.replace('subdominio', 'demo');
    // });
  }
  
  lista() {
    return this.http.get<Contacto[]>(`${this.urlSubDominio}/general/contacto/`);
  }
}


