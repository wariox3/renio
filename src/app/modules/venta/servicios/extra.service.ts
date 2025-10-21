import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ExtraService {
  constructor(private httpService: HttpService) {}

  generarMasivo(payload: { documento_tipo_id?: number; ids?: number[] }) {
    return this.httpService.post<any>('general/documento/generar-recurrente/', payload);
  }
}
