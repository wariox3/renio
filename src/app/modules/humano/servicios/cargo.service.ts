import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { Cargo } from '../interfaces/cargo.interface';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private httpService: HttpService) { }

  guardarCargo(data: Cargo) {
    return this.httpService.post<Cargo>(`humano/cargo/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Cargo>(`humano/cargo/${id}/`);
  }

  actualizarDatosCargo(id: number, data: Cargo) {
    return this.httpService.put<Cargo>(`humano/cargo/${id}/`, data);
  }

}
