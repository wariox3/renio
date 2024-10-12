import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalleFactura(id: number) {
    return this.httpService.getDetalle<{
      documento: DocumentoFacturaRespuesta;
    }>(`general/documento/${id}/`);
  }
}
