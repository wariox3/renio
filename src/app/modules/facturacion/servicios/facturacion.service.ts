import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { FechasService } from '@comun/services/fechas.service';
import { Consumos, Facturas } from '@interfaces/facturacion/Facturacion';

@Injectable({
  providedIn: 'root',
})
export class FacturacionService extends Subdominio {
  constructor(
    private http: HttpClient,
    private fechaServices: FechasService,
  ) {
    super();
  }

  facturacion(usuario_id: number) {
    return this.http.post<Facturas>(
      `${this.URL_API_BASE}/contenedor/movimiento/pendiente/`,
      {
        usuario_id,
      },
    );
  }

  facturacionFechas(usuario_id: number, fechaHasta: any) {
    return this.http.post<Consumos>(
      `${this.URL_API_BASE}/contenedor/consumo/consulta-usuario-fecha/`,
      {
        usuario_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: fechaHasta,
      },
    );
  }

  informacionFacturacion(usuario_id: number) {
    return this.http.post<any>(
      `${this.URL_API_BASE}/contenedor/informacion_facturacion/consulta-usuario/`,
      {
        usuario_id,
      },
    );
  }

  obtenerInformacionFacturacion(usuario_id: any) {
    return this.http.get<{ usuario_id: any }>(
      `${this.URL_API_BASE}/contenedor/informacion_facturacion/${usuario_id}/`,
    );
  }

  obtenerUsuarioVrSaldo(usuario_id: number) {
    return this.http.get<{ saldo: number }>(
      `${this.URL_API_BASE}/seguridad/usuario/saldo/${usuario_id}/`,
    );
  }

  actualizarDatosInformacionFacturacion(informacion_id: any, data: any) {
    return this.http.put<{ informacion_id: any; data: any }>(
      `${this.URL_API_BASE}/contenedor/informacion_facturacion/${informacion_id}/`,
      data,
    );
  }

  crearInformacionFacturacion(data: any) {
    return this.http.post<{ data: any }>(
      `${this.URL_API_BASE}/contenedor/informacion_facturacion/`,
      data,
    );
  }

  eliminarInformacionFacturacion(informacion_id: any) {
    return this.http.delete<{ informacion_id: any }>(
      `${this.URL_API_BASE}/contenedor/informacion_facturacion/${informacion_id}/`,
    );
  }
}
