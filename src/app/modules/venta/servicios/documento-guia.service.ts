import { inject, Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentoGuiaService {

  private _httpService = inject(HttpService);


  constructor() { }

  adicionarGuia(data: any) {
    return this._httpService.post<any>('general/documento_guia/adicionar-guia/', data);
  }

  eliminar(id: number) {
    return this._httpService.post('general/documento_guia/eliminar/', { id });
  }

}
