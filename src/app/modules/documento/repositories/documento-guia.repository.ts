import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoGuiaRepository {
  private readonly _httpService = inject(HttpService);
  private readonly _generalService = inject(GeneralService);

  constructor() {}

  consultarGuias(data: { documento_id: number }) {
    return this._generalService.consultaApi<any>(
      'general/documento_guia/',
      data,
    );
  }

  adicionar(data: any) {
    return this._httpService.post<any>(
      'general/documento_guia/adicionar-guia/',
      data,
    );
  }

  eliminar(id: number) {
    return this._httpService.post('general/documento_guia/eliminar/', { id });
  }
}
