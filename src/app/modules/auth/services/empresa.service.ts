import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
//import { chackRequiereToken } from '@interceptores/token.interceptor';
//import { EmpresaNuevo } from '@core/sitio/interfaces/formularios/empresa-nuevo';
import { chackRequiereToken } from '../../../interceptores/token.interceptor';


interface PeriodicElement {
  id: number;
  usuario_id: number;
  empresa_id: number;
  empresa: string;
}


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) {}


  private apiUrlLista = `${environment.URL_API_MUUP}/seguridad/usuario/empresa/`
  private apiUrlNuevo = `${environment.URL_API_MUUP}/seguridad/empresa/nuevo/`


  lista(codigoUsuario: string) {
    return this.http.get(
      `${this.apiUrlLista}${codigoUsuario}/`
    );
  }

  nuevo(data: any, codigoUsuario: string) {
    return this.http.post(
      `${this.apiUrlNuevo}`,
      {
        empresa: data.nombre,
        usuario: codigoUsuario
      },
      // {
      //   context: chackRequiereToken(),
      // }
    );
  }
}
