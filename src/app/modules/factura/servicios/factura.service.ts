import { Injectable } from '@angular/core';
import { Subdomino } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class FacturaService{
  constructor(private httpService: HttpService) {}

  guardarFactura(data: any) {
    this.httpService
      .post<any>('general/documento/', data)
      .subscribe((respuesta) => {
        console.log('facturas', respuesta);
      });
  }

  actualizarDatosFactura(id: number, data: any){
    this.httpService.put<any>(`general/documento/${id}/`, data)
    .subscribe((respuesta) => {
      console.log('facturas', respuesta);
    });
  }

  consultarDetalle(id: number){
    return this.httpService.get<any>(`general/documento/${id}/`)
  }
}
