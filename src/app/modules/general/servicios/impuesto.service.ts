import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Impuesto } from '../interfaces/impuesto.interface';

@Injectable({
  providedIn: 'root',
})
export class ImpuestoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  actualizarCuenta(id: number, data: any) {
    return this.httpService.put<Impuesto>(`general/impuesto/${id}/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Impuesto>(`general/impuesto/${id}/`);
  }

}
