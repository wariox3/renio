import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaElectronicaService {
  private readonly _httpService = inject(HttpService);

  constructor() {}

  descartarFacturas(data: { id: number }) {
    return this._httpService.post<{ documento: DocumentoFacturaRespuesta }>(
      'general/documento/electronico_descartar/',
      data
    );
  }
}
