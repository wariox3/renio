import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EventosDianService {

  constructor(private httpService: HttpClient) {}


    emitirEvento(data: any){
      return this.httpService.post<any>("general/documento/emitir-evento/", data)
    }

  
}
