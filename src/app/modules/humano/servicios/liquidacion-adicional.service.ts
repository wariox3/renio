import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { LiquidacionAdicional } from '../interfaces/liquidacion-adicional.interface';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionAdicionalService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

   getLiquidacionPorId(id: number) {
     return this.httpService.getDetalle<LiquidacionAdicional>(
       `humano/liquidacion_adicional/${id}/`,
     );
  }

  nuevo(data: LiquidacionAdicional) {
    return this.httpService.post<LiquidacionAdicional>('humano/liquidacion_adicional/', data)
  }

  actualizarDatoAdicional(id: number, data: LiquidacionAdicional){
    return this.httpService.put<LiquidacionAdicional>(`humano/liquidacion_adicional/${id}/`, data);

  }

  eliminar(id: number) {
    return this.httpService.delete(`humano/liquidacion_adicional/${id}/`, {})
  }
}
