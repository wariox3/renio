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

  editar(data: any, codigoUsuario: string, empresa_id: string) {
    return this.http.put(
      `${environment.URL_API_MUUP}/seguridad/usuarioempresa/consulta-usuario/${empresa_id}`,
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
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/verificacion/`,
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
    return this.http.post(
      `${environment.URL_API_MUUP}/`,
      {
        empresa_id,
      }
    )
  }

  eliminarEmpresaUsuario(empresa_id: Number, usuario_id: Number){
    return this.http.post(
      `${environment.URL_API_MUUP}/`,
      {
        empresa_id,
      }
    )
  }
}
