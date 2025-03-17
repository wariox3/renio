import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import {
  MovimientoAuxiliarCuenta,
  RespuestaInformeBalancePrueba,
  RespuestaInformeBalancePruebaTerceros,
} from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';

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
      parametros,
    );
  }

  consultarBalancesTerceros(parametros: any = {}) {
    return this.httpService.post<RespuestaInformeBalancePruebaTerceros>(
      `contabilidad/movimiento/informe-balance-prueba-tercero/`,
      parametros,
    );
  }

  consultarAuxiliarCuenta(parametros: any = {}) {
    return this.httpService.post<{ registros: MovimientoAuxiliarCuenta[] }>(
      `contabilidad/movimiento/informe-auxiliar-cuenta/`,
      parametros,
    );
  }
}
