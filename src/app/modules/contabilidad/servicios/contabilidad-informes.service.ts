import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { RespuestaInformeBalancePrueba } from '@interfaces/contabilidad/contabilidad-balance.interface';

@Injectable({
  providedIn: 'root',
})
export class ContabilidadInformesService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarBalances(parametros: any = {}) {
    return this.httpService.post<RespuestaInformeBalancePrueba>(
      `contabilidad/movimiento/informe-balance-prueba/`,
      parametros
    );
  }
}
