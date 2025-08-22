import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private readonly _httpService = inject(HttpService);

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
