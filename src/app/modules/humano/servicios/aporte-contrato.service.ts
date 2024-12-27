import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AporteContratoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  actualizarDetalles(id: number, data: any) {
    return this.httpService.put<any>(`humano/aporte_contrato/${id}/`, data);
  }

  eliminarRegistro(id: number, data: any) {
    return this.httpService.delete(`humano/aporte_contrato/${id}/`, {});
  }

}
