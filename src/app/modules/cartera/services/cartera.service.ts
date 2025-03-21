import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CarteraService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarCuentaCobrarCorte(data: any) {
    return this.httpService.post<any[]>(`cartera/informe/pendiente-corte/`, data);
  }
}
