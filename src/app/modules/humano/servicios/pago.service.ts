import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { PagoRespuesta } from '../interfaces/pago.interface';
import {
  CargarContratosRespuesta,
  GenerarProgramacionRespuesta,
} from '../interfaces/programacion.interface';

@Injectable({
  providedIn: 'root',
})
export class PagoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.get<PagoRespuesta>(`general/documento/${id}/`);
  }

  actualizarDatosProgramacion(id: number, data: any) {
    return this.httpService.put<PagoRespuesta>(
      `humano/programacion/${id}/`,
      data
    );
  }

  cargarContratos(data: any) {
    return this.httpService.post<CargarContratosRespuesta>(
      `humano/programacion/cargar-contrato/`,
      data
    );
  }

  generar(data: any) {
    return this.httpService.post<GenerarProgramacionRespuesta>(
      `humano/programacion/generar/`,
      data
    );
  }
}
