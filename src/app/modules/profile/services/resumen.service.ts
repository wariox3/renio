import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

interface enviarDatosUsuario  {
  id: String;
  nombreCorto: String,
  nombre: String,
  apellido: String,
  telefono: String,
  idioma: String,
  imagen: String | null
}

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

  actualizarInformacion(data:enviarDatosUsuario){
    return this.http.put(
      `${environment.URL_API_MUUP}/seguridad/usuario/${data.id}/`,
      {"nombre": data.nombre, "apellido": data.apellido, "nombre_corto" : data.nombreCorto, "telefono": data.telefono, "idioma" : data.idioma}
    );
  }
}
