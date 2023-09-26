import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private httpService: HttpService) { }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/documento/${id}/`);
  }

  actualizarDatosEmpresa(id: number, data: any) {
    return this.httpService.put<any>(`general/documento/${id}/`, data);
  }

}
