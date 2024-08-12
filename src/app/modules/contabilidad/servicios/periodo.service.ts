import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { ConPeriodo } from '@interfaces/contabilidad/contabilidad-periodo.interface';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  consultarDetalle() {
    return this.httpService.getDetalle<ConPeriodo[]>(`contabilidad/periodo/`);
  }
}
