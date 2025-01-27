import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class EventosDianService {
  constructor(private httpService: HttpService) {}

  emitirEvento(data: any) {
    return this.httpService.post<any>('general/documento/emitir-evento/', data);
  }

  descartar(id: number){
    return this.httpService.post<any>('general/documento/electronico_descartar/', {id});
  }
}
