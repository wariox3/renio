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
    }>(`general/documento/${id}/detalle/`);
  }

  consultarAIU() {
    return this.httpService.post<{
      configuracion: {
        gen_item_administracion: number;
        gen_item_imprevisto: number;
        gen_item_utilidad: number;
        gen_item_administracion__nombre: string;
        gen_item_imprevisto__nombre: string;
        gen_item_utilidad__nombre: string;
      }[];
    }>(`general/configuracion/consulta/`, {
      campos: [
        'gen_item_administracion',
        'gen_item_imprevisto',
        'gen_item_utilidad',
        'gen_item_administracion__nombre',
        'gen_item_imprevisto__nombre',
        'gen_item_utilidad__nombre',
      ],
    });
  }
}
