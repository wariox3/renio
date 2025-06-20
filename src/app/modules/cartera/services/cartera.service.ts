import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CarteraService extends Subdominio {
  private readonly _generalService = inject(GeneralService);

  constructor(private httpService: HttpService) {
    super();
  }

  consultarCuentaCobrarCorte(data: any) {
    return this.httpService.post<any[]>(
      `cartera/informe/pendiente-corte/`,
      data,
    );
  }

}
