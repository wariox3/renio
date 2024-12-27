import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Credito } from '../interfaces/credito.interface';

@Injectable({
  providedIn: 'root'
})
export class CreditoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarCredito(data: Credito) {
    return this.httpService.post<Credito>(`humano/credito/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Credito>(`humano/credito/${id}/`);
  }

  actualizarDatoCredito(id: number, data: Credito) {
    return this.httpService.put<Credito>(`humano/credito/${id}/`, data);
  }

}
