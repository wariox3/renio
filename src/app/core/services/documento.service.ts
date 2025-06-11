import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly _generalService = inject(GeneralService);

  constructor() {}

  getDocumento(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi(
      'general/documento/',
      queryParams,
    );
  }
}
