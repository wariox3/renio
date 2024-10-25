import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ProgramacionDetalleRegistro } from '@interfaces/humano/programacion';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionDetalleService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  actualizarDetalles(id: number, data: Partial<ProgramacionDetalleRegistro>) {
    return this.httpService.put<ProgramacionDetalleRegistro>(`humano/programacion_detalle/${id}/`, data);
  }

  eliminarRegistro(id: number, data: any) {
    return this.httpService.delete(`humano/programacion_detalle/${id}/`, {});
  }

  notificar(id: number){
    return this.httpService.post('humano/programacion/notificar/', {id})
  }
}
