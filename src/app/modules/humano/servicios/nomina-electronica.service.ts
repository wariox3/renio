import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { NominaElectronica } from '@modulos/humano/interfaces/nomina-electronica.interface.';

@Injectable({
  providedIn: 'root'
})
export class NominaElectronicaService extends Subdominio {

  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<NominaElectronica>(`general/documento/${id}/`);
  }
}
