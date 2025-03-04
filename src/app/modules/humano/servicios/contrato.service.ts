import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ContratoService extends Subdominio {
  constructor(private httpService: HttpService, private store: Store) {
    super();
  }

  guardarContrato(data: any) {
    return this.httpService.post<any[]>(`humano/contrato/`, data);
  }

  guardarParametrosIniciales(data: any) {
    return this.httpService.post<any>(`humano/contrato/parametros-iniciales/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/contrato/${id}/`);
  }

  actualizarDatosContacto(id: number, data: any) {
    return this.httpService.put<any>(`humano/contrato/${id}/`, data);
  }
}
