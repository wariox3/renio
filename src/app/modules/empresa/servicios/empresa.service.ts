import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Empresa, EmpresaInvitacion } from '@interfaces/usuario/empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private http: HttpClient) {}

  lista(codigoUsuario: string) {
    return this.http.get<Empresa[]>(
      `${environment.URL_API_MUUP}/seguridad/usuario/empresa/${codigoUsuario}/`
    );
  }

  nuevo(data: any, codigoUsuario: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/empresa/nuevo/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        usuario: codigoUsuario,
        imagen:
          'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
      }
      // {
      //   context: chackRequiereToken(),
      // }
    );
  }

  detalle(codigoEmpresa: string) {
    return this.http.get<Empresa>(
      `${environment.URL_API_MUUP}/inquilino/empresa/${codigoEmpresa}`
    );
  }

  consultarNombre(subdominio: string) {
    return this.http.post<{ validar: boolean }>(
      `${environment.URL_API_MUUP}/inquilino/empresa/validar/`,
      {
        subdominio,
      }
    );
  }

  enviarInvitacion(data: EmpresaInvitacion) {
    return this.http.post(`${environment.URL_API_MUUP}/seguridad/verificacion/`, {
      accion: 'invitar',
      empresa_id: data.empresa_id,
      usuario_id: data.usuario_id,
      invitado: data.invitado,
    });
  }
}
