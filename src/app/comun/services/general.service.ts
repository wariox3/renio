import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { AutocompletarRegistros } from '@interfaces/comunes/autocompletar/autocompletar';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { HttpParams } from '@angular/common/http';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private readonly _httpService = inject(HttpService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  consultaApi<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    let params = new HttpParams();

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== null && queryParams[key] !== undefined) {
        params = params.append(key, queryParams[key].toString());
      }
    });

    return this._httpService.getDetalle<T>(endpoint, params);
  }

  consultarConfiguracion<T>(parametros: { campos?: string[] }): Observable<T> {
    return this._httpService.post<T>(
      'general/configuracion/consulta/',
      parametros,
    );
  }
}
