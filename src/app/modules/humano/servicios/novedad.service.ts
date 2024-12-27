import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Novedad } from '../interfaces/novedad.interface';

@Injectable({
  providedIn: 'root'
})
export class NovedadService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarNovedad(data: Novedad) {
    return this.httpService.post<Novedad>(`humano/novedad/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Novedad>(`humano/novedad/${id}/`);
  }

  actualizarDatoNovedad(id: number, data: Novedad) {
    return this.httpService.put<Novedad>(`humano/novedad/${id}/`, data);
  }

}
