import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Sede } from '@modulos/general/interfaces/sede.interface';

@Injectable({
  providedIn: 'root'
})
export class SedeService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
   }

   guardarSede(data: any) {
    return this.httpService.post<Sede[]>(`general/sede/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Sede>(`general/sede/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`general/sede/${id}/`, data);
  }
}
