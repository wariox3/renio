import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConCuenta } from '@modulos/contabilidad/interfaces/contabilidad-cuenta.interface';
import { cuentaTraslado } from '../interfaces/cuenta-traslado';
import { RespuestaCuentaTraslado } from '../interfaces/respuesta-cuenta-traslado';
import { GeneralService } from '@comun/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class CuentaService extends Subdominio {
  private readonly _generalService = inject(GeneralService);
  constructor(private httpService: HttpService) {
    super();
  }

  guardarCuenta(data: ConCuenta) {
    return this.httpService.post<ConCuenta>(`contabilidad/cuenta/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<ConCuenta>(`contabilidad/cuenta/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<ConCuenta>) {
    return this.httpService.put<ConCuenta>(`contabilidad/cuenta/${id}/`, data);
  }

  // logica de negocio

  // calculamos el rango de ids para los selectores
  calcularRangoIds(
    id: number,
    multiplicador: number,
    desplazamiento: number,
  ): { idDesde: number; idHasta: number } {
    const idDesde = id * multiplicador;
    const idHasta = id * multiplicador + desplazamiento;

    return { idDesde, idHasta };
  }

  traslado(data: cuentaTraslado) {
    return this.httpService.post<RespuestaCuentaTraslado>(
      `contabilidad/cuenta/trasladar/`,
      data,
    );
  }

  consultarCuentaClase(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi<any>(
      'contabilidad/cuenta_clase/',
      queryParams,
    );
  }

  consultarCuentaGrupo(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi<any>(
      'contabilidad/cuenta_grupo/',
      queryParams,
    );
  }

  consultarCuentaCuenta(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi<any>(
      'contabilidad/cuenta_cuenta/',
      queryParams,
    );
  }
}
