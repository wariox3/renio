import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';
import { Activo } from '../interfaces/contabilidad-activo.interface';

@Injectable({
  providedIn: 'root',
})
export class ActivoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardar(data: ConGrupo) {
    return this.httpService.post<Activo>(`contabilidad/activo/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Activo>(`contabilidad/activo/${id}/`);
  }

  actualizarDatos(id: number, data: Partial<Activo>) {
    return this.httpService.put<Activo>(`contabilidad/activo/${id}/`, data);
  }
}
