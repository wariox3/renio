import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  Contenedor,
  ContenedorFormulario,
  ContenedorInvitacion,
  ContenedorLista,
} from '@interfaces/usuario/contenedor';
import { FechasService } from '@comun/services/fechas.service';
import { Plan } from '@interfaces/contenedor/plan';
import { Consumo } from '@interfaces/contenedor/consumo';

@Injectable({
  providedIn: 'root',
})
export class ContenedorService {
  constructor(private http: HttpClient, private fechaServices: FechasService) {}

  lista(usuario_id: string) {
    return this.http.post<ContenedorLista>(
      `${environment.URL_API_MUUP}/contenedor/usuariocontenedor/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }

  nuevo(data: ContenedorFormulario, usuario_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/contenedor/contenedor/`,
      {
        ...data,
        usuario_id
      }
    );
  }

  detalle(codigoContenedor: string) {
    return this.http.get<Contenedor>(
      `${environment.URL_API_MUUP}/contenedor/contenedor/${codigoContenedor}/`
    );
  }

  consultarNombre(subdominio: string) {
    return this.http.post<{ validar: boolean }>(
      `${environment.URL_API_MUUP}/contenedor/contenedor/validar/`,
      {
        subdominio,
      }
    );
  }

  consultarInformacion(empresa_id: Number | string) {
    return this.http.get<ContenedorFormulario>(
      `${environment.URL_API_MUUP}/contenedor/contenedor/${empresa_id}/`
    );
  }

  editar(
    data: ContenedorFormulario,
    codigoUsuario: string,
    empresa_id: string
  ) {
    return this.http.put(
      `${environment.URL_API_MUUP}/contenedor/contenedor/${empresa_id}/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        plan: data.plan_id,
        usuario: codigoUsuario,
      }
    );
  }

  enviarInvitacion(data: ContenedorInvitacion) {
    return this.http.post(
      `${environment.URL_API_MUUP}/contenedor/usuariocontenedor/invitar/`,
      {
        accion: 'invitar',
        contenedor_id: data.contenedor_id,
        usuario_id: data.usuario_id,
        invitado: data.invitado,
      }
    );
  }

  listaInvitaciones(contenedor_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/contenedor/usuariocontenedor/consulta-contenedor/`,
      {
        contenedor_id,
      }
    );
  }

  eliminarEmpresa(empresa_id: Number) {
    return this.http.delete(
      `${environment.URL_API_MUUP}/contenedor/contenedor/${empresa_id}/`
    );
  }

  eliminarEmpresaUsuario(usuario_id: Number) {
    return this.http.delete(
      `${environment.URL_API_MUUP}/contenedor/usuariocontenedor/${usuario_id}/`
    );
  }

  listaPlanes() {
    return this.http.get<Plan[]>(
      `${environment.URL_API_MUUP}/contenedor/plan/`
    );
  }

  listaCiudades(arrFiltros: any) {
    return this.http.post<Plan[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/lista-autocompletar/`,
      arrFiltros
    );
  }

  listaTipoIdentificacion() {
    return this.http.post<Plan[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/lista-autocompletar/`,
      {
        filtros: [],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'ContenedorIdentificacion',
      }
    );
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.http.post<{ cargar: boolean }>(
      `${environment.URL_API_MUUP}/contenedor/contenedor/cargar-logo/`,
      {
        empresa_id,
        imagenB64,
      }
    );
  }

  eliminarLogoEmpresa(empresa_id: Number | string) {
    return this.http.post<{
      limpiar: boolean;
      imagen: string;
    }>(`${environment.URL_API_MUUP}/contenedor/contenedor/limpiar-logo/`, {
      empresa_id,
    });
  }

  consultarConsumoFecha(empresa_id: Number | string) {
    return this.http.post<Consumo>(
      `${environment.URL_API_MUUP}/contenedor/consumo/consulta-empresa-fecha/`,
      {
        empresa_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: this.fechaServices.obtenerUltimoDiaDelMes(new Date()),
      }
    );
  }
}
