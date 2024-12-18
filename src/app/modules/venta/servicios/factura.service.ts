import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(private httpService: HttpService) {}

  guardarFactura(data: any) {
    return this.httpService.post<any>('general/documento/', data);
  }

  actualizarDatosFactura(id: number, data: any) {
    return this.httpService.put<any>(`general/documento/${id}/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/documento/${id}/`);
  }

  aprobar(data: number){
    return this.httpService.post<any>('general/documento/aprobar/', data);
  }

  emitir(id: number) {
    return this.httpService
      .post('general/documento/emitir/', { documento_id: id })
  }
}
