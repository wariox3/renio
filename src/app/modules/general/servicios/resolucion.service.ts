import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { Resolucion } from '@interfaces/general/resolucion';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ResolucionService {
  constructor(private httpService: HttpService, private store: Store) {}

  guardarResolucion(data: any) {
    return this.httpService.post<Resolucion>('general/resolucion/', data);
  }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/resolucion/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<any>(`general/resolucion/${id}/`, data);
  }

}
