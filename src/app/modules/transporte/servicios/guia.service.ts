import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';


@Injectable({
  providedIn: 'root',
})
export class GuiaService {
  private _generalService = inject(GeneralService);
  constructor() { }

  lista(queryParams: any = {}) {
    return this._generalService.consultaApi<any>('transporte/guia/', queryParams);
  }

}
