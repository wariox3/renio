import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Asesor } from '@interfaces/general/Asesor';

@Injectable({
  providedIn: 'root'
})
export class CuentaService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
   }

   guardarCuenta(data: any) {
    return this.httpService.post<any>(`contabilidad/cuenta/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Asesor>(`contabilidad/cuenta/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`contabilidad/cuenta/${id}/`, data);
  }
}
