import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class dashboardService {
  constructor(private httpService: HttpService) {}

  resumenCobrar(data: any) {
    return this.httpService.post<any>('general/documento/resumen-cobrar/', data);
  }

  resumenPagar(data: any) {
    return this.httpService.post<any>('general/documento/resumen-pagar/', data);
  }

  ventaPorDia(data: any) {
    return this.httpService.post<any>('general/documento/resumen-venta-dia/', data);
  }

}
