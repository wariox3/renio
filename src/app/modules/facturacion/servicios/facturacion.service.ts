import { obtenerUsuarioVrSaldo } from './../../../redux/selectors/usuario.selectors';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Consumos, Facturas } from '@interfaces/facturacion/Facturacion';
import { HttpClient } from '@angular/common/http';
import { FechasService } from '@comun/services/fechas.service';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(private http: HttpClient, private fechaServices: FechasService) { }

  facturacion(usuario_id: string) {
    return this.http.post<Facturas>(
      `${environment.URL_API_MUUP}/contenedor/movimiento/pendiente/`,
      {
        usuario_id,
      }
    );
  }

  facturacionFechas(usuario_id: string, fechaHasta: any) {
    return this.http.post<Consumos>(
      `${environment.URL_API_MUUP}/contenedor/consumo/consulta-usuario-fecha/`,
      {
        usuario_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: fechaHasta
      }
    );
  }

  informacionFacturacion(usuario_id: string) {
    return this.http.post<any>(
      `${environment.URL_API_MUUP}/contenedor/informacion_facturacion/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }


  obtenerInformacionFacturacion(usuario_id: any) {
    return this.http.get<{usuario_id: any}>(
      `${environment.URL_API_MUUP}/contenedor/informacion_facturacion/${usuario_id}/`,
    );
  }


  obtenerUsuarioVrSaldo(usuario_id: string) {
    return this.http.get<{saldo: number}>(
      `${environment.URL_API_MUUP}/seguridad/usuario/saldo/${usuario_id}/`,
    );
  }

  actualizarDatosInformacionFacturacion(informacion_id: any, data: any) {
    return this.http.put<{informacion_id: any, data: any}>(
      `${environment.URL_API_MUUP}/contenedor/informacion_facturacion/${informacion_id}/`, data);
  }

  crearInformacionFacturacion(data: any) {
    return this.http.post<{data: any}>(
      `${environment.URL_API_MUUP}/contenedor/informacion_facturacion/`, data);
  }

  eliminarInformacionFacturacion(informacion_id: any) {
    return this.http.delete<{informacion_id: any}>(
      `${environment.URL_API_MUUP}/contenedor/informacion_facturacion/${informacion_id}/`);
  }


}
