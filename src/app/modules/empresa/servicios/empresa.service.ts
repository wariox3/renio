import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  Inquilino,
  InquilinoFormulario,
  InquilinoInvitacion,
  InquilinoLista,
} from '@interfaces/usuario/inquilino';
import { Plan } from '../modelos/plan';
import { FechasService } from '@comun/services/fechas.service';

export interface Consumo {
  vr_plan: number;
  vr_total: number;
  consumosPlan: ConsumoPlan[];
}

export interface ConsumoPlan {
  plan_id: number;
  vr_plan: number;
  vr_total: number;
  plan_nombre: string
}

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private http: HttpClient,
   private fechaServices: FechasService) {}

  lista(usuario_id: string) {
    return this.http.post<InquilinoLista>(
      `${environment.URL_API_MUUP}/inquilino/usuarioinquilino/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }

  nuevo(data: InquilinoFormulario, codigoUsuario: string) {
    return this.http.post(`${environment.URL_API_MUUP}/inquilino/inquilino/`, {
      nombre: data.nombre,
      subdominio: data.subdominio,
      usuario_id: codigoUsuario,
      plan_id: data.plan_id,
      imagen: data.imagen,
    });
  }

  detalle(codigoInquilino: string) {
    return this.http.get<Inquilino>(
      `${environment.URL_API_MUUP}/inquilino/inquilino/${codigoInquilino}`
    );
  }

  consultarNombre(subdominio: string) {
    return this.http.post<{ validar: boolean }>(
      `${environment.URL_API_MUUP}/inquilino/inquilino/validar/`,
      {
        subdominio,
      }
    );
  }

  consultarInformacion(empresa_id: Number | string) {
    return this.http.get<InquilinoFormulario>(
      `${environment.URL_API_MUUP}/inquilino/inquilino/${empresa_id}/`
    );
  }

  editar(data: InquilinoFormulario, codigoUsuario: string, empresa_id: string) {
    return this.http.put(
      `${environment.URL_API_MUUP}/inquilino/inquilino/${empresa_id}/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        plan: data.plan_id,
        usuario: codigoUsuario,
      }
    );
  }

  enviarInvitacion(data: InquilinoInvitacion) {
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/usuarioinquilino/invitar/`,
      {
        accion: 'invitar',
        inquilino_id: data.inquilino_id,
        usuario_id: data.usuario_id,
        invitado: data.invitado,
      }
    );
  }

  listaInvitaciones(inquilino_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/inquilino/usuarioinquilino/consulta-inquilino/`,
      {
        inquilino_id,
      }
    );
  }

  eliminarEmpresa(empresa_id: Number) {
    return this.http.delete(
      `${environment.URL_API_MUUP}/inquilino/inquilino/${empresa_id}/`
    );
  }

  eliminarEmpresaUsuario(usuario_id: Number) {
    return this.http.delete(
      `${environment.URL_API_MUUP}/inquilino/usuarioinquilino/${usuario_id}/`
    );
  }

  listaPlanes() {
    return this.http.get<Plan[]>(`${environment.URL_API_MUUP}/inquilino/plan/`);
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.http.post<{cargar: boolean}>(
      `${environment.URL_API_MUUP}/inquilino/inquilino/cargar-logo/`,
      {
        empresa_id,
        imagenB64,
      }
    );
  }

  eliminarLogoEmpresa(empresa_id: Number | string) {
    return this.http.post<{
      limpiar: boolean,
      imagen: string
    }>(
      `${environment.URL_API_MUUP}/inquilino/inquilino/limpiar-logo/`,
      {
        empresa_id,
      }
    );
  }

  consultarConsumoFecha(empresa_id: Number | string) {
    return this.http.post<Consumo>(
      `${environment.URL_API_MUUP}/inquilino/consumo/consulta-empresa-fecha/`,
      {
        empresa_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: this.fechaServices.obtenerUltimoDiaDelMes(new Date()),
      }
    );
  }
}
