import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  constructor(private http: HttpClient) {}

  perfil(codigoUsuario: string) {
    return this.http.get(
      `${environment.URL_API_MUUP}/seguridad/usuario/${codigoUsuario}/`
    );
  }

  actualizarInformacion(id: string, name: string, last_name: string){
    return this.http.put(
      `${environment.URL_API_MUUP}/seguridad/usuario/${id}/`,
      {"name": name,"last_name": last_name}
    );
  }
}
