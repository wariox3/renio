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

  generar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/generar/`, { id });
  }

  desgenerar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/desgenerar/`, { id });
  }

  desaprobar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/desaprobar/`, { id });
  }

  reliquiar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/reliquidar/`, { id });
  }
}
  