import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentoDetalleRepository {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);

  constructor() {}

  consultar(queryParams: ParametrosApi = {}) {
    return this._generalService.consultaApi<RespuestaApi<any>>(
      'general/documento_detalle/',
      queryParams,
    );
  }

  actualizar(id: number, data: any) {
    return this._httpService.patch<any>(
      `general/documento_detalle/${id}/`,
      data,
    );
  }
}
