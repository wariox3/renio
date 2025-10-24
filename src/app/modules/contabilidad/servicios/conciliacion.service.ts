import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';
import { Conciliacion } from '../interfaces/conciliacion.interface';

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarConciliacion(data: ConGrupo) {
    return this.httpService.post<Conciliacion>(
      `contabilidad/conciliacion/`,
      data,
    );
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Conciliacion>(
      `contabilidad/conciliacion/${id}/`,
    );
  }

  actualizarDatos(id: number, data: Partial<any>) {
    return this.httpService.put<Conciliacion>(
      `contabilidad/conciliacion/${id}/`,
      data,
    );
  }

  eliminarSoporte(id: number) {
    return this.httpService.delete(
      `contabilidad/conciliacion_soporte/${id}/`,
      {},
    );
  }

  consultarConciliacionDetalle(data: any) {
    return this.httpService.getDetalle<any>(
      `contabilidad/conciliacion_detalle/`,
      data,
    );
  }

  limpiarDetalles(id: number) {
    return this.httpService.post<any>(`contabilidad/conciliacion_detalle/limpiar/`, {
      conciliacion_id: id,
    });
  }

  cargarDetalle(id: number) {
    return this.httpService.post<any>(`contabilidad/conciliacion_detalle/cargar/`, {
      conciliacion_id: id,
    });
  }

  conciliar(id: number) {
    return this.httpService.post<any>(`contabilidad/conciliacion/conciliar/`, {
      id,
    });
  }

  limpiarSoporte(id: number) {
    return this.httpService.post<any>(`contabilidad/conciliacion_soporte/limpiar/`, {
      conciliacion_id: id,
    });
  }

  eliminarConciliacion(id: number) {
    return this.httpService.delete(
      `contabilidad/conciliacion/${id}/`,
      {},
    );
  }

  consultarConciliacionSoporte(data: any) {
    return this.httpService.getDetalle<any>(
      `contabilidad/conciliacion_soporte/`,
      {
        ...data,
        ordering: 'id',
      },
    );
  }
}
