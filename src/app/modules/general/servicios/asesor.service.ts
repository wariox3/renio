import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Asesor } from '@interfaces/general/Asesor';

@Injectable({
  providedIn: 'root'
})
export class AsesorService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
   }

   guardarAsesor(data: any) {
    return this.httpService.post<Asesor[]>(`general/asesor/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Asesor>(`general/asesor/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`general/asesor/${id}/`, data);
  }
}
