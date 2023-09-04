import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentoDetalleService {

  constructor(private httpService: HttpService) { }

  nuevoDetalle(documento:number){
    return this.httpService.post<any>("general/documentodetalle/",{
      item: null,
      documento
    })
  }
}
