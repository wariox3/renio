import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Aporte } from '../interfaces/aporte';
import { AporteCargarContratos } from '../interfaces/aporte-cargar-contratos';

@Injectable({
  providedIn: 'root',
})
export class AporteService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.get<Aporte>(`humano/aporte/${id}/`);
  }

  actualizarDatosAporte(id: number, data: Aporte) {
    return this.httpService.put<Aporte>(`humano/aporte/${id}/`, data);
  }

  cargarContratos(data: Pick<Aporte, 'id'>) {
    return this.httpService.post<AporteCargarContratos>(
      `humano/aporte/cargar-contrato/`,
      data
    );
  }

  guardarAporte(data: Aporte) {
    return this.httpService.post<Aporte>(`humano/aporte/`, data);
  }

  generar(data: any) {
    return this.httpService.post<any>(`humano/aporte/generar/`, data);
  }

  desgenerar(data: any) {
    return this.httpService.post<any>(`humano/aporte/desgenerar/`, data);
  }

  eliminarRegistro(id: number, data: any) {
    return this.httpService.delete(`humano/aporte_contrato/${id}/`, {});
  }

  planoOperador(data: Pick<Aporte, 'id'>) {
    return this.httpService.descargarArchivo(`humano/aporte/plano-operador/`, data);
  }
}
