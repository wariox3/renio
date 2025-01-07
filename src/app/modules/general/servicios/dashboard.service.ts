import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { ResumenCobrar } from '../interfaces/resumen-cobrar';
import { ResumenPagar } from '../interfaces/resumen-pagar';
import { ResumenVentaDias } from '../interfaces/resumen-venta-dia';

@Injectable({
  providedIn: 'root',
})
export class dashboardService {
  constructor(private httpService: HttpService) {}

  resumenCobrar(data: any) {
    return this.httpService.post<ResumenCobrar>('general/documento/resumen-cobrar/', data);
  }

  resumenPagar(data: any) {
    return this.httpService.post<ResumenPagar>('general/documento/resumen-pagar/', data);
  }

  ventaPorDia(data: any) {
    return this.httpService.post<ResumenVentaDias>('general/documento/resumen-venta-dia/', data);
  }

}
