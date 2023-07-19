import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  Empresa,
  EmpresaFormulario,
  EmpresaInvitacion,
  EmpresaLista
} from '@interfaces/usuario/empresa';
import { Plan } from '../modelos/plan';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private http: HttpClient) {}

  lista(usuario_id: string) {
    return this.http.post<EmpresaLista>(
      `${environment.URL_API_MUUP}/inquilino/usuarioempresa/consulta-usuario/`,
      {
        usuario_id
      }
    );
  }

  nuevo(data: EmpresaFormulario, codigoUsuario: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/empresa/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        usuario: codigoUsuario,
        plan_id: data.plan_id,
        imagen: data.imagen,
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

  consultarInformacion(empresa_id: Number | string) {
    return this.http.get(`${environment.URL_API_MUUP}/inquilino/empresa/${empresa_id}/`);
  }

  editar(data: EmpresaFormulario, codigoUsuario: string, empresa_id: Number) {
    return this.http.put(
      `${environment.URL_API_MUUP}/inquilino/empresa/${empresa_id}/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        plan: data.plan_id,
        usuario: codigoUsuario,
        imagen: data.imagen
      }
    );
  }

  enviarInvitacion(data: EmpresaInvitacion) {
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/usuarioempresa/invitar/`,
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
      `${environment.URL_API_MUUP}/inquilino/usuarioempresa/consulta-empresa/`,
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
      `${environment.URL_API_MUUP}/inquilino/usuarioempresa/${usuario_id}/`
    )
  }

  listaPlanes() {
    return this.http.get<Plan[]>(
      `${environment.URL_API_MUUP}/inquilino/plan/`
    );
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string){
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/empresa/cargar-logo/`, {
        empresa_id,
        imagenB64
      }
    );
  }

  eliminarLogoEmpresa(empresa_id: Number | string){
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/empresa/limpiar-logo/`, {
        empresa_id
      }
    );
  }
}
