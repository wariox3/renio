import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Liquidacion } from '../interfaces/liquidacion.interface';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  getLiquidacionPorId(id: number) {
    return this.httpService.getDetalle<Liquidacion>(
      `humano/liquidacion/${id}/`,
    );
  }

  aprobar(id: number) {
    return this.httpService.post(`humano/liquidacion/aprobar/`, { id });
  }

  generar(data: { id: number }) {
    return this.httpService.post<any>(`humano/liquidacion/generar/`, data);
  }

  desgenerar(data: { id: number }) {
    return this.httpService.post<any>(`humano/liquidacion/desgenerar/`, data);
  }

  desaprobar(data: any) {
    return this.httpService.post<any>(`humano/liquidacion/desaprobar/`, data);
  }
}
