import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FechasService } from '@comun/services/fechas.service';
import { environment } from '@env/environment';

interface enviarDatosUsuario {
  id: String;
  nombreCorto: String;
  nombre: String;
  apellido: String;
  telefono: String;
  idioma: String;
  imagen: String | null;
}

export interface Factura {
  fecha: string;
  id: number;
  tipo: string;
  vr_afectado: number;
  vr_saldo: number;
  vr_total: number;
}

export interface Facturas {
  movimientos: Factura[];
}

export interface Consumo {
  vr_plan: number;
  vr_total: number;
}

export interface Consumos {
  consumos: Consumo;
}

@Injectable({
  providedIn: 'root',
})
export class ResumenService {
  constructor(private http: HttpClient, private fechaServices: FechasService) {}

  perfil(codigoUsuario: string) {
    return this.http.get(
      `${environment.URL_API_MUUP}/seguridad/usuario/${codigoUsuario}/`
    );
  }

  actualizarInformacion(data: enviarDatosUsuario) {
    return this.http.put(
      `${environment.URL_API_MUUP}/seguridad/usuario/${data.id}/`,
      {
        nombre: data.nombre,
        apellido: data.apellido,
        nombre_corto: data.nombreCorto,
        telefono: data.telefono,
        idioma: data.idioma,
      }
    );
  }

  facturacion(usuario_id: string) {
    return this.http.post<Facturas>(
      `${environment.URL_API_MUUP}/contenedor/movimiento/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }

  facturacionFechas(usuario_id: string) {
    return this.http.post<Consumos>(
      `${environment.URL_API_MUUP}/contenedor/consumo/consulta-usuario-fecha/`,
      {
        usuario_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: this.fechaServices.obtenerUltimoDiaDelMes(new Date()),
      }
    );
  }

  cargarImagen(usuario_id: Number | string, imagenB64: string) {
    return this.http.post<{
      cargar: boolean;
      imagen: string
    }>(`${environment.URL_API_MUUP}/seguridad/usuario/cargar-imagen/`, {
      usuario_id,
      imagenB64,
    });
  }

  eliminarImagen(usuario_id: Number | string) {
    return this.http.post<{
      limpiar: boolean,
      imagen: string
    }>(`${environment.URL_API_MUUP}/seguridad/usuario/limpiar-imagen/`, {
      usuario_id,
    });
  }
}
