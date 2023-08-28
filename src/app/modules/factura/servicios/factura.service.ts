import { Injectable } from '@angular/core';
import { Subdomino } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService extends Subdomino {

  constructor(private httpService: HttpService) {
    super()
   }

   guardarFactura(data:any){
    this.httpService.post<any>('general/documento/', data).subscribe((respuesta)=>{
      console.log('facturas', respuesta);
    })
   }
}
