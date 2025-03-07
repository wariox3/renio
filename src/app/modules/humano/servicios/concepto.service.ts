import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConceptoNomina } from '../interfaces/concepto-nomina.interface';

@Injectable({
  providedIn: 'root',
})
export class ConceptoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  agregarConceptoCuenta(data: any) {
    return this.httpService.post<any[]>(`humano/concepto_cuenta/`, data);
  }

  eliminarConceptoCuenta(id: number) {
    return this.httpService.delete(`humano/concepto_cuenta/${id}`, {});
  }

  actualizarConceptoCuenta(id: number, data: any) {
    return this.httpService.patch<any>(`humano/concepto_cuenta/${id}/`, data);
  }

  guardarConcepto(data: any) {
    return this.httpService.post<any[]>(`humano/concepto/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<any>(`humano/concepto/${id}/`);
  }

  actualizarDatosConcepto(id: number, data: any) {
    return this.httpService.put<any>(`humano/concepto/${id}/`, data);
  }

  actualizarConceptoNomina(id: number, data: ConceptoNomina) {
    return this.httpService.put<ConceptoNomina>(
      `humano/concepto_nomina/${id}/`,
      data,
    );
  }
}
