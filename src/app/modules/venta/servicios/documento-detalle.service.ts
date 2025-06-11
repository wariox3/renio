import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoDetalleService {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);

  constructor() {}

  nuevoDetalle(documento: number) {
    return this._httpService.post<any>('general/documentodetalle/', {
      item: null,
      documento,
    });
  }

  documentoDetalle(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi(
      'general/documento_detalle/',
      queryParams,
    );
  }
}
