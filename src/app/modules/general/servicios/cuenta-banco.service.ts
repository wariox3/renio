import { inject, Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { CuentaBanco } from '../interfaces/cuenta-banco.interface';
import { GeneralService } from '@comun/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class CuentaBancoService extends Subdominio {
  private readonly _generalService = inject(GeneralService);

  constructor(private httpService: HttpService) {
    super();
  }

  guardarCuentaBanco(data: CuentaBanco) {
    return this.httpService.post<CuentaBanco>(`general/cuenta_banco/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<CuentaBanco>(`general/cuenta_banco/${id}/`);
  }

  actualizarDatos(id: number, data: CuentaBanco) {
    return this.httpService.put<CuentaBanco>(`general/cuenta_banco/${id}/`, data);
  }

  consultarCuentaBanco(queryParams: { [key: string]: any } = {}) {
    return this._generalService.consultaApi<any>(
      'general/cuenta_banco/',
      queryParams,
    );
  }
}
