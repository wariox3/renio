import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(private httpService: HttpService) {}

  guardarFactura(data: any) {
    return this.httpService.post<{ documento: DocumentoFacturaRespuesta }>(
      'general/documento/',
      data,
    );
  }

  actualizarDatosFactura(id: number, data: any) {
    return this.httpService.put<{ documento: DocumentoFacturaRespuesta }>(
      `general/documento/${id}/`,
      data,
    );
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<{
      documento: DocumentoFacturaRespuesta;
    }>(`general/documento/${id}/`);
  }

  aprobar(data: number) {
    return this.httpService.post<any>('general/documento/aprobar/', data);
  }

  emitir(id: number) {
    return this.httpService.post('general/documento/emitir/', {
      documento_id: id,
    });
  }

  actualizarDetalleGrupo(id: number, data: any) {
    return this.httpService.patch<any>(
      `general/documento_detalle/${id}/`,
      data,
    );
  }

  cargarResultados(data: any) {
    return this.httpService.post<any>(
      'general/documento/cargar-cierre/',
      data,
    );
  }
}
