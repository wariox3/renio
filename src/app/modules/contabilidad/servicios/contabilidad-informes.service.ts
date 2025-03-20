import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import {
  MovimientoAuxiliarCuenta,
  MovimientoAuxiliarGeneral,
  MovimientoAuxiliarTercero,
  MovimientoBalancePruebaTercero,
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

  consultarCertificadoRetencion(parametros: any = {}) {
    return this.httpService.post<RespuestaInformeBalancePrueba>(
      `contabilidad/movimiento/informe-certificado-retencion/`,
      parametros,
    );
  }

  consultarBalancesTerceros(parametros: any = {}) {
    return this.httpService.post<RespuestaInformeBalancePruebaTerceros>(
      `contabilidad/movimiento/informe-balance-prueba-tercero/`,
      parametros,
    );
  }

  consultarBase(parametros: any = {}) {
    return this.httpService.post<RespuestaInformeBalancePruebaTerceros>(
      `contabilidad/movimiento/informe-base/`,
      parametros,
    );
  }

  consultarAuxiliarCuenta(parametros: any = {}) {
    return this.httpService.post<{ registros: MovimientoAuxiliarCuenta[] }>(
      `contabilidad/movimiento/informe-auxiliar-cuenta/`,
      parametros,
    );
  }

  consultarAuxiliarTercero(parametros: any = {}) {
    return this.httpService.post<{ registros: MovimientoAuxiliarTercero[] }>(
      `contabilidad/movimiento/informe-auxiliar-tercero/`,
      parametros,
    );
  }

  consultarAuxiliarGeneral(parametros: any = {}) {
    return this.httpService.post<{
      registros: MovimientoAuxiliarGeneral[];
    }>(`contabilidad/movimiento/informe-auxiliar-general/`, parametros);
  }
}
