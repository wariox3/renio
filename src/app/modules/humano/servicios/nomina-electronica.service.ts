import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { NominaElectronica } from '@modulos/humano/interfaces/nomina-electronica.interface.';
import { NominaElectronicaGenerar } from '../interfaces/nomina-electronica-generar.interface';
import { GenerarNominaElectronicaResumen } from '../interfaces/nomina-electronica-resumen.interface';

@Injectable({
  providedIn: 'root'
})
export class NominaElectronicaService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<{ documento: NominaElectronica }>(`general/documento/${id}/`);
  }

  generarNominaElectronica(data: NominaElectronicaGenerar) {
    return this.httpService.post<GenerarNominaElectronicaResumen>(
      `general/documento/generar-nomina-electronica/`,
      data
    );
  }

}
