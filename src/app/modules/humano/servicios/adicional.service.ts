import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarAdicional(data: any) {
    return this.httpService.post<any[]>(`humano/adicional/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/adicional/${id}/`);
  }

  actualizarDatosAdicional(id: number, data: any) {
    return this.httpService.put<any>(`humano/adicional/${id}/`, data);
  }

  eliminarAdicional(id: number) {
    return this.httpService.delete(`humano/adicional/${id}/`, {});
  }

}
