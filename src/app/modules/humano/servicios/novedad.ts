import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class NovedadService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarNovedad(data: any) {
    return this.httpService.post<any[]>(`humano/novedad/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/novedad/${id}/`);
  }

  actualizarDatoNovedad(id: number, data: any) {
    return this.httpService.put<any>(`humano/novedad/${id}/`, data);
  }

}
