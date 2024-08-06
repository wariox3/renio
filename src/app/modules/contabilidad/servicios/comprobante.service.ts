import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarComprobante(data: any) {
    return this.httpService.post<any>(`contabilidad/comprobante/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`contabilidad/comprobante/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`contabilidad/comprobante/${id}/`, data);
  }
}
