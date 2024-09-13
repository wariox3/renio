import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  generarNominaElectronica(data: { anio: number; mes: number }) {
    return this.httpService.post<{ resumen: number }>(
      `general/documento/generar-nomina-electronica/`,
      data
    );
  }
}
