import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';

@Injectable({
  providedIn: 'root',
})
export class GrupoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarGrupo(data: ConGrupo) {
    return this.httpService.post<ConGrupo>(`contabilidad/grupo/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<ConGrupo>(`contabilidad/grupo/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<ConGrupo>) {
    return this.httpService.put<ConGrupo>(`contabilidad/grupo/${id}/`, data);
  }
}
