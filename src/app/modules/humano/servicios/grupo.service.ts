import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarGrupo(data: any) {
    return this.httpService.post<any[]>(`humano/grupo/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/grupo/${id}/`);
  }

  actualizarDatosGrupo(id: number, data: any) {
    return this.httpService.put<any>(`humano/grupo/${id}/`, data);
  }

}
