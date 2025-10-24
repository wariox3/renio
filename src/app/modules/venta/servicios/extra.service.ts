import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtraService {
  private _generacionExitosa$ = new Subject<boolean>();
  
  constructor(private httpService: HttpService) {}

  generarMasivo(payload: { documento_tipo_id?: number; ids?: number[] }) {
    return this.httpService.post<any>('general/documento/generar-recurrente/', payload);
  }

  // Observable para notificar cuando la generación es exitosa
  get generacionExitosa$() {
    return this._generacionExitosa$.asObservable();
  }

  // Método para emitir el evento de generación exitosa
  notificarGeneracionExitosa() {
    this._generacionExitosa$.next(true);
  }
}
