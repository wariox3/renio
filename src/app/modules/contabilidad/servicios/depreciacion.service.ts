import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DepreciacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  cargarActivos(id: number) {
    return this.httpService.post<any>(`general/documento/cargar-activo/`, {
      id,
    });
  }

  // consultarDetalle(id: number) {
  //   return this.httpService.getDetalle<any>(`contabilidad/cuenta/${id}/`);
  // }

  // actualizarDatos(id: number, data: any) {
  //   return this.httpService.put<any>(`contabilidad/cuenta/${id}/`, data);
  // }
}
