import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  Empresa,
  EmpresaInvitacion,
  EmpresaLista
} from '@interfaces/usuario/empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private http: HttpClient) {}

  lista(usuario_id: string) {
    return this.http.post<EmpresaLista>(
      `${environment.URL_API_MUUP}/seguridad/usuarioempresa/consulta-usuario/`,
      {
        usuario_id
      }
    );
  }

  nuevo(data: any, codigoUsuario: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/empresa/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        usuario: codigoUsuario,
        imagen:
          'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
      }
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

  consultarInformacion(empresa_id: Number) {
    return this.http.get(`${environment.URL_API_MUUP}/inquilino/empresa/${empresa_id}/`);
  }

  editar(data: any, codigoUsuario: string, empresa_id: Number) {
    return this.http.put(
      `${environment.URL_API_MUUP}/inquilino/empresa/${empresa_id}/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        usuario: codigoUsuario,
        imagen:
          'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
      }
    );
  }

  enviarInvitacion(data: EmpresaInvitacion) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/usuarioempresa/invitar/`,
      {
        accion: 'invitar',
        empresa_id: data.empresa_id,
        usuario_id: data.usuario_id,
        invitado: data.invitado,
      }
    );
  }

  listaInvitaciones(empresa_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/usuarioempresa/consulta-empresa/`,
      {
        empresa_id,
      }
    );
  }

  eliminarEmpresa(empresa_id: Number){
    return this.http.delete(
      `${environment.URL_API_MUUP}/inquilino/empresa/${empresa_id}/`,
    )
  }

  eliminarEmpresaUsuario(usuario_id: Number){
    return this.http.delete(
      `${environment.URL_API_MUUP}/seguridad/usuarioempresa/${usuario_id}/`
    )
  }
}
