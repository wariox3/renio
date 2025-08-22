import { inject, Injectable } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
private _generalService = inject(GeneralService);

  operaciones() {
    return this._generalService.consultaApi<any>(`transporte/operacion/seleccionar/`);
  }
}
