import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import {
  ConPeriodo,
  PeriodoInconsistencia,
} from '@modulos/contabilidad/interfaces/contabilidad-periodo.interface';
import { PeriodoCierre } from '../interfaces/contabilidad-periodo-cierre.interface';
import { PeriodoBloquear } from '../interfaces/contabilidad-periodo-bloquear.interface';
import { PeriodoDesbloquear } from '../interfaces/contabilidad-periodo-desbloquear.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { GeneralService } from '@comun/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }
  private readonly _generalService = inject(GeneralService);

  consultarDetalle() {
    return this.httpService.getDetalle<RespuestaApi<ConPeriodo>>(`contabilidad/periodo/`);
  }

  consultarPeriodos(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi<RespuestaApi<any>>(
      'contabilidad/periodo/',
      queryParams,
    );
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
