import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { RespuestaResumen } from '../interfaces/resumen';
import { ResumenVentaDias } from '../interfaces/resumen-venta-dia';

@Injectable({
  providedIn: 'root',
})
export class dashboardService {
  constructor(private httpService: HttpService) {}

  resumenCobrar() {
    return this.httpService.getDetalle<RespuestaResumen>('general/documento/resumen-cobrar/');
  }

  resumenPagar() {
    return this.httpService.getDetalle<RespuestaResumen>('general/documento/resumen-pagar/');
  }

  ventaPorDia() {
    return this.httpService.getDetalle<ResumenVentaDias>('general/documento/resumen-venta-dia/');
  }

}
