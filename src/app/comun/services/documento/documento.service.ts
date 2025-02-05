import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly _httpService = inject(HttpService);

  desaprobarDocumento(payload: { id: number }) {
    return this._httpService.post('general/documento/desaprobar/', payload);
  }

  contabilizar(payload: { id: number }) {
    return this._httpService.post('general/documento/contabilizar/', payload);
  }

  descontabilizar(payload: { id: number }) {
    return this._httpService.post(
      'general/documento/descontabilizar/',
      payload
    );
  }
}
