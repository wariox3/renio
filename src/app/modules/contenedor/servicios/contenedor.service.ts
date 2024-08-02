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
import { Ciudad } from '@interfaces/general/ciudad';
import { TipoIdentificacionLista } from '@interfaces/general/tipoIdentificacion';
import { Regimen } from '@interfaces/general/regimen';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { Movimientos } from '@interfaces/facturacion/Facturacion';

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
        reddoc: true
      }
    );
  }

  nuevo(data: ContenedorFormulario, usuario_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/contenedor/contenedor/`,
      {
        ...data,
        usuario_id,
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
    return this.http.post<Ciudad[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/autocompletar/`,
      arrFiltros
    );
  }

  listaTipoIdentificacion() {
    return this.http.post<TipoIdentificacionLista[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/autocompletar/`,
      {
        filtros: [],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'CtnIdentificacion',
      }
    );
  }

  listaRegimen() {
    return this.http.post<Regimen[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/autocompletar/`,
      {
        filtros: [],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'CtnRegimen',
      }
    );
  }

  listaTipoPersona() {
    return this.http.post<TipoPersona[]>(
      `${environment.URL_API_MUUP}/contenedor/funcionalidad/autocompletar/`,
      {
        filtros: [],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'CtnTipoPersona',
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

  contenedorGenerarIntegridad(data: any) {
    return this.http.post<{ hash: string }>(
      `${environment.URL_API_MUUP}/contenedor/movimiento/generar-integridad/`,
      {
        ...data,
      }
    );
  }

  consultaUsuario(usuario_id: string) {
    return this.http.post<Movimientos>(
      `${environment.URL_API_MUUP}/contenedor/movimiento/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }

  descargarDocumento(documento_id: any) {
    return this.http.post<any>(
      `${environment.URL_API_MUUP}/contenedor/movimiento/descargar/`,
      {
        'id' : documento_id
      }
    );
  }

  reenviarCorreoVerificacion(usuario_id: string){
    return this.http.post<Movimientos>(
      `${environment.URL_API_MUUP}/contenedor/verificacion/reenviar-verificacion/ `,
      {
        usuario_id,
      }
    );

  }

  consultarMovimientoSocio(socio_id: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/contenedor/movimiento/consulta-socio/`,
      {
        socio_id,
      }
    );
  }

  informacionPlan: any = {
    1: [
      'LANDINGPAGE.CANTIDADDOCUMENTO10',
      'LANDINGPAGE.PRECIO1USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO10',
      'LANDINGPAGE.SOPORTETECNICO',
    ],
    2: [
      'LANDINGPAGE.CANTIDADDOCUMENTO10',
      'LANDINGPAGE.PRECIO1USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO10',
      'LANDINGPAGE.SOPORTETECNICO',
      'LANDINGPAGE.CONTABILIDAD',
      'LANDINGPAGE.COMPRA',
      'LANDINGPAGE.FACTURACION',
      'LANDINGPAGE.TESORERIA',
      'LANDINGPAGE.CARTERA',
    ],
    3: [
      'LANDINGPAGE.CANTIDADDOCUMENTO100',
      'LANDINGPAGE.PRECIO2USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO50',
      'LANDINGPAGE.SOPORTETECNICO',
    ],
    4: [
      'LANDINGPAGE.CANTIDADDOCUMENTO100',
      'LANDINGPAGE.PRECIO2USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO50',
      'LANDINGPAGE.SOPORTETECNICO',
      'LANDINGPAGE.CONTABILIDAD',
      'LANDINGPAGE.COMPRA',
      'LANDINGPAGE.FACTURACION',
      'LANDINGPAGE.NOMINA',
      'LANDINGPAGE.TESORERIA',
      'LANDINGPAGE.CARTERA',
    ],
    5: [
      'LANDINGPAGE.CANTIDADDOCUMENTO500',
      'LANDINGPAGE.PRECIO3USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO200',
      'LANDINGPAGE.SOPORTETECNICO',
    ],
    6: [
      'LANDINGPAGE.CANTIDADDOCUMENTO500',
      'LANDINGPAGE.PRECIO3USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO200',
      'LANDINGPAGE.SOPORTETECNICO',
      'LANDINGPAGE.CONTABILIDAD',
      'LANDINGPAGE.COMPRA',
      'LANDINGPAGE.FACTURACION',
      'LANDINGPAGE.NOMINA',
      'LANDINGPAGE.TESORERIA',
      'LANDINGPAGE.CARTERA',
    ],
    7: [
      'LANDINGPAGE.CANTIDADDOCUMENTOILIMITADO',
      'LANDINGPAGE.PRECIO8USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO500',
      'LANDINGPAGE.SOPORTETECNICO',
    ],
    8: [
      'LANDINGPAGE.CANTIDADDOCUMENTOILIMITADO',
      'LANDINGPAGE.PRECIO8USUARIOS',
      'LANDINGPAGE.INGRESOMAXIMO500',
      'LANDINGPAGE.SOPORTETECNICO',
      'LANDINGPAGE.CONTABILIDAD',
      'LANDINGPAGE.COMPRA',
      'LANDINGPAGE.FACTURACION',
      'LANDINGPAGE.NOMINA',
      'LANDINGPAGE.TESORERIA',
      'LANDINGPAGE.CARTERA',
    ],
  };
}
