import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { Consumo } from '@interfaces/contenedor/consumo';
import { Movimientos } from '@interfaces/facturacion/Facturacion';
import {
  Contenedor,
  ContenedorFormulario,
  ContenedorInvitacion,
  ContenedorInvitacionLista,
  ContenedorLista,
  RespuestaConectar,
} from '@interfaces/usuario/contenedor';
import { Plan } from '@modulos/contenedor/interfaces/plan.interface';
import { map } from 'rxjs';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Injectable({
  providedIn: 'root',
})
export class ContenedorService extends Subdominio {
  totalItems: number = 0;
  private _generalService = inject(GeneralService);
  private _filterTransformService = inject(FilterTransformerService);
  private _cookieService = inject(CookieService);

  constructor(
    private http: HttpClient,
    private fechaServices: FechasService,
  ) {
    super();
  }

  private _isContenedorRestringido(valorSaldo: number, fechaLimitePago: string) {
    // Si no hay fecha límite, no hay restricción
    if (!fechaLimitePago) {
      return false;
    }
    
    const fechaHoy = new Date();
    const fechaLimite = new Date(fechaLimitePago);
    
    // Normalizar las fechas para comparar solo año, mes y día
    const hoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate());
    const limite = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());

    // Si el saldo es mayor a 0 y la fecha límite ya pasó
    if (valorSaldo > 0 && hoy > limite) {
      return true; // Contenedor restringido
    }

    return false; // Contenedor no restringido
  }

  private _agregarPropiedades(contenedores: ContenedorLista[]) {
    // Obtener el usuario de la cookie para verificar saldo y fecha límite
    const usuarioCookie = this._cookieService?.get('usuario');
    let valorSaldo = 0;
    let fechaLimitePago = '';
    
    if (usuarioCookie) {
      try {
        const usuario = JSON.parse(usuarioCookie);
        valorSaldo = usuario.vr_saldo || 0;
        fechaLimitePago = usuario.fecha_limite_pago || '';
      } catch (error) {
        console.error('Error al parsear la cookie de usuario:', error);
      }
    }
    
    return contenedores.map((contenedor) => {
      return {
        ...contenedor,
        acceso_restringido: this._isContenedorRestringido(valorSaldo, fechaLimitePago)
      };
    });
  }

  lista(parametros: Record<string, any>) {
    const params = this._filterTransformService.toQueryString({
      ...parametros,
      serializador: 'lista',
      contenedor__reddoc: 'True',
    });

    return this.http
      .get<
        RespuestaApi<ContenedorLista>
      >(`${this.URL_API_BASE}/contenedor/usuariocontenedor/?${params}`)
      .pipe(
        map((res) => {
          // Store the total count for pagination
          this.totalItems = res.count;
          return {
            ...res,
            results: this._agregarPropiedades(res.results),
          };
        }),
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
        aplicacion: data.aplicacion,
        contenedor_id: data.contenedor_id,
        usuario_id: data.usuario_id,
        invitado: data.invitado,
      },
    );
  }

  listaInvitaciones(contenedor_id: number) {
    return this.http.get<RespuestaApi<ContenedorInvitacionLista>>(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/?contenedor_id=${contenedor_id}`,
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
    Object.keys(arrFiltros).forEach((key) => {
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
    return this.http.get(`${this.URL_API_BASE}/contenedor/regimen/?limit=10`);
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
