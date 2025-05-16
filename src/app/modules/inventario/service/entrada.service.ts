import { inject, Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { DocumentoInventarioRespuesta } from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private _httpService = inject(HttpService)

  constructor() { }


  guardarFactura(data: any) {
    return this._httpService.post<{ documento: DocumentoInventarioRespuesta }>(
      'general/documento/nuevo/',
      data
    );
  }


  actualizarDatos(data: any) {
    return this._httpService.post<{ documento: DocumentoInventarioRespuesta }>(
      `general/documento/actualizar/`,
      data
    );
  }


  consultarDetalle(id: number) {
    return this._httpService.getDetalle<{
      documento: DocumentoInventarioRespuesta;
    }>(`general/documento/${id}/`);
  }


}
