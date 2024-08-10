import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConCuenta } from '@interfaces/contabilidad/contabilidad-cuenta.interface';

@Injectable({
  providedIn: 'root'
})
export class CuentaService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
   }

   guardarCuenta(data: ConCuenta) {
    return this.httpService.post<ConCuenta>(`contabilidad/cuenta/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<ConCuenta>(`contabilidad/cuenta/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<ConCuenta>) {
    return this.httpService.put<ConCuenta>(`contabilidad/cuenta/${id}/`, data);
  }
}
