import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarConciliacion(data: ConGrupo) {
    return this.httpService.post<ConGrupo>(`contabilidad/conciliacion/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`contabilidad/conciliacion/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<any>) {
    return this.httpService.put<any>(`contabilidad/conciliacion/${id}/`, data);
  }
}
