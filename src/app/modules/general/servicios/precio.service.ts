import { HttpService } from '@comun/services/http.service';
import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { Precio } from '@modulos/general/interfaces/precio.interface';
import { GeneralService } from '@comun/services/general.service';
import { PrecioDetalle } from '../interfaces/precio';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class PrecioService  extends Subdominio {
  private readonly _generalService = inject(GeneralService);
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

  guardarPrecioDetalle(data: any) {
    return this.httpService.post<any>(`general/precio_detalle/`, data);
  }

  consultarPrecioDetalles(id: number) {
    return this._generalService.consultaApi<RespuestaApi<PrecioDetalle>>(`general/precio_detalle/`, {
      precio_id: id,
      ordering: 'id'
    });
  }

  actualizarPrecioDetalle(id: number, data: any) {
    return this.httpService.put<any>(`general/precio_detalle/${id}/`, data);
  }

  eliminarPrecioDetalle(id: number) {
    return this.httpService.delete(`general/precio_detalle/${id}/`, {});
  }
}
