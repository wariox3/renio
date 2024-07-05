import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CuentaBancoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarCuentaBanco(data: any) {
    return this.httpService.post<any>(`general/cuenta_banco/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`general/cuenta_banco/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`general/cuenta_banco/${id}/`, data);
  }
}
