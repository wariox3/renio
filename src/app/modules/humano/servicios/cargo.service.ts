import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private httpService: HttpService) { }

  guardarCargo(data: any) {
    return this.httpService.post<any[]>(`humano/cargo/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/cargo/${id}/`);
  }

  actualizarDatosCargo(id: number, data: any) {
    return this.httpService.put<any>(`humano/cargo/${id}/`, data);
  }


}
