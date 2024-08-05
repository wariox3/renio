import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarProgramacion(data: any) {
    return this.httpService.post<any[]>(`humano/programacion/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/programacion/${id}/`);
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
