import { HttpService } from '@comun/services/http.service';
import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { Precio } from '@modulos/general/interfaces/precio.interface';

@Injectable({
  providedIn: 'root'
})
export class PrecioService  extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }


  guardarPrecio(data: any) {
    return this.httpService.post<Precio[]>(`general/precio/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Precio>(`general/precio/${id}/`);
  }

  actualizarDatos(id: number, data: Precio) {
    return this.httpService.put<Precio>(`general/precio/${id}/`, data);
  }

  guardarPrecioDetalle(id: number, data: any) {
    return this.httpService.post<any>(`general/precio/listadetalle/`, data);
  }
}
