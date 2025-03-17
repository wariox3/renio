import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import {
  CargarContratosRespuesta,
  DesgenerarProgramacionRespuesta,
  GenerarProgramacionRespuesta,
  ProgramacionRespuesta,
} from '../interfaces/programacion.interface';

@Injectable({
  providedIn: 'root',
})
export class ProgramacionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarProgramacion(data: any) {
    return this.httpService.post<ProgramacionRespuesta>(
      `humano/programacion/`,
      data,
    );
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<ProgramacionRespuesta>(
      `humano/programacion/${id}/`,
    );
  }

  actualizarDatosProgramacion(id: number, data: any) {
    return this.httpService.put<ProgramacionRespuesta>(
      `humano/programacion/${id}/`,
      data,
    );
  }

  cargarContratos(data: any) {
    return this.httpService.post<CargarContratosRespuesta>(
      `humano/programacion/cargar-contrato/`,
      data,
    );
  }

  desaprobar(data: any) {
    return this.httpService.post<any>(`humano/programacion/desaprobar/`, data);
  }

  generar(data: { id: number }) {
    return this.httpService.post<GenerarProgramacionRespuesta>(
      `humano/programacion/generar/`,
      data,
    );
  }

  desgenerar(data: { id: number }) {
    return this.httpService.post<DesgenerarProgramacionRespuesta>(
      `humano/programacion/desgenerar/`,
      data,
    );
  }
}
