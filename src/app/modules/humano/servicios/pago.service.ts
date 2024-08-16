import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PagoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/documento/${id}/`);
  }

  actualizarDatosProgramacion(id: number, data: any) {
    return this.httpService.put<any>(`humano/programacion/${id}/`, data);
  }

  cargarContratos(data: any) {
    return this.httpService.post<any>(`humano/programacion/cargar-contrato/`, data);
  }

  generar(data: any) {
    return this.httpService.post<any>(`humano/programacion/generar/`, data);
  }
  

}
