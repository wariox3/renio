import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Contacto } from '@interfaces/general/contacto';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ContactoService extends Subdominio {
  constructor(private httpService: HttpService, private store: Store) {
    super();
  }

  guardarContacto(data: any) {
    return this.httpService.post<Contacto[]>(`general/contacto/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Contacto>(`general/contacto/${id}/`);
  }

  actualizarDatosContacto(id: number, data: any) {
    return this.httpService.put<any>(`general/contacto/${id}/`, data);
  }
}
