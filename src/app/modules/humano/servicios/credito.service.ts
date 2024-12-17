import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CreditoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarCredito(data: any) {
    return this.httpService.post<any[]>(`humano/credito/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/credito/${id}/`);
  }

  actualizarDatoCredito(id: number, data: any) {
    return this.httpService.put<any>(`humano/credito/${id}/`, data);
  }

}
