import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Sucursal } from '../interfaces/Sucursal';

@Injectable({
  providedIn: 'root'
})
export class SucursalService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  guardarSucursal(data: Sucursal) {
    return this.httpService.post<Sucursal>(`humano/sucursal/`, data);
  }

  actualizarSucursal(id: number, data: Sucursal) {
    return this.httpService.put<Sucursal>(`humano/sucursal/${id}/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Sucursal>(`humano/sucursal/${id}/`);
  }

}
