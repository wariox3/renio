import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AporteService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`humano/aporte/${id}/`);
  }

  actualizarDatosAporte(id: number, data: any) {
    return this.httpService.put<any>(`humano/aporte/${id}/`, data);
  }

  cargarContratos(data: any) {
    return this.httpService.post<any>(`humano/aporte/cargar-contrato/`, data);
  }


  guardarAporte(data: any){
    return this.httpService.post<any>(`humano/aporte/`, data);
  }

  generar(data: any) {
    return this.httpService.post<any>(`humano/aporte/generar/`, data);
  }

  desgenerar(data: any) {
    return this.httpService.post<any>(`humano/aporte/desgenerar/`, data);
  }


  eliminarRegistro(id: number, data: any) {
    return this.httpService.delete(`humano/aporte_contrato/${id}/`, {});
  }
}
