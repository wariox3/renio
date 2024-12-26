import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { Resolucion } from '@interfaces/general/resolucion.interface';
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
    return this.httpService.get<Resolucion>(`general/resolucion/${id}/`);
  }

  actualizarDatos(id: number, data: any) {
    return this.httpService.put<Resolucion>(`general/resolucion/${id}/`, data);
  }

}
