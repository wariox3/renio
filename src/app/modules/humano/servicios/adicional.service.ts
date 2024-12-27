import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Adicional } from '../interfaces/adicional.interface';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarAdicional(data: Adicional) {
    return this.httpService.post<Adicional>(`humano/adicional/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Adicional>(`humano/adicional/${id}/`);
  }

  actualizarDatosAdicional(id: number, data: Adicional) {
    return this.httpService.put<Adicional>(`humano/adicional/${id}/`, data);
  }

  eliminarAdicional(id: number) {
    return this.httpService.delete(`humano/adicional/${id}/`, {});
  }

}
