import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { RespuestaFormaPago } from '../interfaces/forma-pago.interface';

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  constructor(private httpService: HttpService) {}

  guardar(data: any) {
    return this.httpService.post<RespuestaFormaPago>('general/forma_pago/', data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<RespuestaFormaPago>(`general/forma_pago/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<RespuestaFormaPago>(`general/forma_pago/${id}/`, data);
  }
}
