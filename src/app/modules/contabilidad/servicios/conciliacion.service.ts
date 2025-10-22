import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';
import { Conciliacion } from '../interfaces/conciliacion.interface';

@Injectable({
  providedIn: 'root',
})
export class ConciliacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarConciliacion(data: ConGrupo) {
    return this.httpService.post<Conciliacion>(`contabilidad/conciliacion/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Conciliacion>(`contabilidad/conciliacion/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<any>) {
    return this.httpService.put<Conciliacion>(`contabilidad/conciliacion/${id}/`, data);
  }
}
