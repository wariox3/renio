import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import {
  ConPeriodo,
  PeriodoInconsistencia,
} from '@modulos/contabilidad/interfaces/contabilidad-periodo.interface';
import { PeriodoCierre } from '../interfaces/contabilidad-periodo-cierre.interface';
import { PeriodoBloquear } from '../interfaces/contabilidad-periodo-bloquear.interface';
import { PeriodoDesbloquear } from '../interfaces/contabilidad-periodo-desbloquear.interface';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle() {
    return this.httpService.getDetalle<ConPeriodo[]>(`contabilidad/periodo/`);
  }

  consultarInconsistencias(anio: number, mes: number) {
    return this.httpService.post<{ inconsistencia: PeriodoInconsistencia[] }>(
      `contabilidad/periodo/inconsistencia/`,
      {
        anio,
        mes,
      },
    );
  }

  crearPeriodo(data: number) {
    return this.httpService.post<PeriodoCierre>(
      `contabilidad/periodo/anio-nuevo/`,
      data,
    );
  }

  cerrar(id: number) {
    return this.httpService.post<PeriodoCierre>(
      `contabilidad/periodo/cerrar/`,
      {
        id,
      },
    );
  }

  bloquear(id: number) {
    return this.httpService.post<PeriodoBloquear>(
      `contabilidad/periodo/bloquear/`,
      {
        id,
      },
    );
  }

  desbloquear(id: number) {
    return this.httpService.post<PeriodoDesbloquear>(
      `contabilidad/periodo/desbloquear/`,
      {
        id,
      },
    );
  }
}
