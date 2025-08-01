import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import { Consumo } from '@interfaces/contenedor/consumo';
import { Movimientos } from '@interfaces/facturacion/Facturacion';
import { Regimen } from '@interfaces/general/regimen.interface';
import { TipoIdentificacionLista } from '@interfaces/general/tipo-identificacion.interface';
import { TipoPersona } from '@interfaces/general/tipo-persona.interface';
import {
  Contenedor,
  ContenedorFormulario,
  ContenedorInvitacion,
  ContenedorLista,
  RespuestaConectar,
} from '@interfaces/usuario/contenedor';
import { Plan } from '@modulos/contenedor/interfaces/plan.interface';
import { Ciudad } from '@modulos/general/interfaces/ciudad.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ContenedorService extends Subdominio {

  private _generalService = inject(GeneralService);

  constructor(
    private http: HttpClient,
    private fechaServices: FechasService,
  ) {
    super();
  }

  lista(usuario_id: number) {
    return this.http.post<ContenedorLista>(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/consulta-usuario/`,
      {
        usuario_id,
        reddoc: true,
      },
    );
  }

  nuevo(data: ContenedorFormulario, usuario_id: number) {
    return this.http.post(`${this.URL_API_BASE}/contenedor/contenedor/`, {
      ...data,
      usuario_id,
    });
  }

  detalle(codigoContenedor: number) {
    return this.http.get<Contenedor>(
      `${this.URL_API_BASE}/contenedor/contenedor/${codigoContenedor}/`,
    );
  }

  consultarNombre(subdominio: string) {
    return this.http.post<{ validar: boolean }>(
      `${this.URL_API_BASE}/contenedor/contenedor/validar/`,
      {
        subdominio,
      },
    );
  }

  consultarInformacion(empresa_id: Number | string) {
    return this.http.get<RespuestaConectar>(
      `${this.URL_API_BASE}/contenedor/contenedor/${empresa_id}/`,
    );
  }

  editar(
    data: ContenedorFormulario,
    codigoUsuario: number,
    empresa_id: number,
  ) {
    return this.http.put(
      `${this.URL_API_BASE}/contenedor/contenedor/${empresa_id}/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        plan: data.plan_id,
        usuario: codigoUsuario,
      },
    );
  }

  enviarInvitacion(data: ContenedorInvitacion) {
    return this.http.post(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/invitar/`,
      {
        accion: 'invitar',
        contenedor_id: data.contenedor_id,
        usuario_id: data.usuario_id,
        invitado: data.invitado,
      },
    );
  }

  listaInvitaciones(contenedor_id: number) {
    return this.http.post(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/consulta-contenedor/`,
      {
        contenedor_id,
      },
    );
  }

  eliminarEmpresa(empresa_id: Number) {
    return this.http.delete(
      `${this.URL_API_BASE}/contenedor/contenedor/${empresa_id}/`,
    );
  }

  eliminarEmpresaUsuario(usuario_id: Number) {
    return this.http.delete(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/${usuario_id}/`,
    );
  }

  listaPlanes() {
    return this.http.get<RespuestaApi<Plan>>(
      `${this.URL_API_BASE}/contenedor/plan/?ordering=orden`,
    );
  }

  listaCiudades(arrFiltros: any) {
    let params = new HttpParams();
    Object.keys(arrFiltros).forEach(key => {
      if (arrFiltros[key] !== null && arrFiltros[key] !== undefined) {
        params = params.append(key, arrFiltros[key].toString());
      }
    });

    return this.http.get(
      `${this.URL_API_BASE}/contenedor/ciudad/seleccionar/?${params}`,
    );
  }

  listaTipoIdentificacion() {

    return this.http.get(
      `${this.URL_API_BASE}/contenedor/identificacion/?limit=10`,
    );
  }

  listaRegimen() {
    return this.http.get(
      `${this.URL_API_BASE}/contenedor/regimen/?limit=10`,
    );
  }

  listaTipoPersona() {
    return this.http.get(
      `${this.URL_API_BASE}/contenedor/tipo_persona/?limit=10`,
    );
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.http.post<{ cargar: boolean; imagen: string }>(
      `${this.URL_API_BASE}/contenedor/contenedor/cargar-logo/`,
      {
        empresa_id,
        imagenB64,
      },
    );
  }

  eliminarLogoEmpresa(empresa_id: Number | string) {
    return this.http.post<{
      limpiar: boolean;
      imagen: string;
    }>(`${this.URL_API_BASE}/contenedor/contenedor/limpiar-logo/`, {
      empresa_id,
    });
  }

  consultarConsumoFecha(empresa_id: Number | string) {
    return this.http.post<Consumo>(
      `${this.URL_API_BASE}/contenedor/consumo/consulta-empresa-fecha/`,
      {
        empresa_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: this.fechaServices.obtenerUltimoDiaDelMes(new Date()),
      },
    );
  }

  contenedorGenerarIntegridad(data: any) {
    return this.http.post<{ hash: string }>(
      `${this.URL_API_BASE}/contenedor/movimiento/generar-integridad/`,
      {
        ...data,
      },
    );
  }

  consultaUsuario(usuario_id: number) {
    return this.http.post<Movimientos>(
      `${this.URL_API_BASE}/contenedor/movimiento/consulta-usuario/`,
      {
        usuario_id,
      },
    );
  }

  descargarDocumento(documento_id: any) {
    return this.http.post<any>(
      `${this.URL_API_BASE}/contenedor/movimiento/descargar/`,
      {
        id: documento_id,
      },
    );
  }

  reenviarCorreoVerificacion(usuario_id: string) {
    return this.http.post<Movimientos>(
      `${this.URL_API_BASE}/contenedor/verificacion/reenviar-verificacion/ `,
      {
        usuario_id,
      },
    );
  }

  consultarMovimientoSocio(socio_id: string) {
    return this.http.post(
      `${this.URL_API_BASE}/contenedor/movimiento/consulta_credito/`,
      {
        socio_id,
      },
    );
  }

  contenedorConectar(subdominio: string) {
    return this.http.post<RespuestaConectar>(
      `${this.URL_API_BASE}/contenedor/contenedor/conectar/`,
      {
        subdominio,
      },
    );
  }

  contenedorMovimientoAplicarFiltro(data: any) {
    return this.http.post(
      `${this.URL_API_BASE}/contenedor/movimiento/aplicar-credito/`,
      data,
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
      'LANDINGPAGE.COMPRAYFACTURACION',
      'LANDINGPAGE.TESORERIAYCARTERA',
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
      'LANDINGPAGE.COMPRAYFACTURACION',
      'LANDINGPAGE.TESORERIAYCARTERA',
      'LANDINGPAGE.POS',
      'LANDINGPAGE.CONTABILIDAD',
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
      'LANDINGPAGE.COMPRAYFACTURACION',
      'LANDINGPAGE.TESORERIAYCARTERA',
      'LANDINGPAGE.NOMINA',
      'LANDINGPAGE.POS',
      'LANDINGPAGE.CONTABILIDAD',
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
      'LANDINGPAGE.SOPORTEESPECIALIZADO',
      'LANDINGPAGE.COMPRAYFACTURACION',
      'LANDINGPAGE.TESORERIAYCARTERA',
      'LANDINGPAGE.NOMINA',
      'LANDINGPAGE.POS',
      'LANDINGPAGE.CONTABILIDAD',
      'LANDINGPAGE.APIINTEGRACION',
      'LANDINGPAGE.TABLEROANALITICA',
    ],
  };
}
