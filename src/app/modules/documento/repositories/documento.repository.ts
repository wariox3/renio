import { inject, Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { GenerarMasivoPayload } from '../interfaces/gen-documento.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentoRepository {
  private readonly _httpService = inject(HttpService);

  constructor() {}

  aprobar(data: number) {
    return this._httpService.post<any>('general/documento/aprobar/', data);
  }

  emitir(id: number) {
    return this._httpService.post('general/documento/emitir/', {
      documento_id: id,
    });
  }

  guardar(data: any) {
    return this._httpService.post<{ documento: any }>(
      'general/documento/nuevo/',
      data,
    );
  }

  actualizar(data: any) {
    return this._httpService.post<{ documento: any }>(
      `general/documento/actualizar/`,
      data,
    );
  }

  actualizarPorId(id: number, data: any) {
    return this._httpService.patch<any>(
      `general/documento/${id}/`,
      data,
    );
  }

  detalle(id: number) {
    return this._httpService.getDetalle<{
      documento: any;
    }>(`general/documento/${id}/detalle/`);
  }

  generarMasivo(payload: GenerarMasivoPayload) {
    return this._httpService.post<any>(
      'general/documento/generar-masivo/',
      payload,
    );
  }

  descartarFacturas(data: { id: number }) {
    return this._httpService.post<{ documento: any }>(
      'general/documento/electronico_descartar/',
      data,
    );
  }

  cargarResultados(data: any) {
    return this._httpService.post<any>(
      'general/documento/cargar-cierre/',
      data,
    );
  }
}
