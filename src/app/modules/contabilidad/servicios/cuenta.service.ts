import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConCuenta } from '@modulos/contabilidad/interfaces/contabilidad-cuenta.interface';
import { cuentaTraslado } from '../interfaces/cuenta-traslado';
import { RespuestaCuentaTraslado } from '../interfaces/respuesta-cuenta-traslado';

@Injectable({
  providedIn: 'root',
})
export class CuentaService extends Subdominio {
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
    desplazamiento: number
  ): { idDesde: number; idHasta: number } {
    const idDesde = id * multiplicador;
    const idHasta = id * multiplicador + desplazamiento;

    return { idDesde, idHasta };
  }

  traslado(data: cuentaTraslado){
    return this.httpService.post<RespuestaCuentaTraslado>(`contabilidad/cuenta/trasladar/`, data);
  }
}
