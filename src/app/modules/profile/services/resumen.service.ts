import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { FechasService } from '@comun/services/fechas.service';
import { Consumos, Facturas } from '@interfaces/facturacion/Facturacion';
import { enviarDatosUsuario } from '../interfaces/enviar-datos-usuario.interface';
import { UsuarioInformacionPerfil } from '../interfaces/usuario-Informacion-perfil';

@Injectable({
  providedIn: 'root',
})
export class ResumenService extends Subdominio {
  constructor(
    private http: HttpClient,
    private fechaServices: FechasService,
  ) {
    super();
  }

  perfil(codigoUsuario: number) {
    return this.http.get<UsuarioInformacionPerfil>(
      `${this.URL_API_BASE}/seguridad/usuario/${codigoUsuario}/`,
    );
  }

  actualizarInformacion(data: enviarDatosUsuario) {
    return this.http.put<UsuarioInformacionPerfil>(
      `${this.URL_API_BASE}/seguridad/usuario/${data.id}/`,
      {
        nombre: data.nombre,
        apellido: data.apellido,
        nombre_corto: data.nombreCorto,
        telefono: data.telefono,
        idioma: data.idioma,
        cargo: data.cargo,
        numero_identificacion: data.numero_identificacion,
      },
    );
  }

  facturacion(usuario_id: string) {
    return this.http.post<Facturas>(
      `${this.URL_API_BASE}/contenedor/movimiento/pendiente/`,
      {
        usuario_id,
      },
    );
  }

  facturacionFechas(usuario_id: string, fechaHasta: any) {
    return this.http.post<Consumos>(
      `${this.URL_API_BASE}/contenedor/consumo/consulta-usuario-fecha/`,
      {
        usuario_id,
        fechaDesde: this.fechaServices.obtenerPrimerDiaDelMes(new Date()),
        fechaHasta: fechaHasta,
      },
    );
  }

  cargarImagen(usuario_id: Number | string, imagenB64: string) {
    return this.http.post<{
      cargar: boolean;
      imagen: string;
    }>(`${this.URL_API_BASE}/seguridad/usuario/cargar-imagen/`, {
      usuario_id,
      imagenB64,
    });
  }

  eliminarImagen(usuario_id: Number | string) {
    return this.http.post<{
      limpiar: boolean;
      imagen: string;
    }>(`${this.URL_API_BASE}/seguridad/usuario/limpiar-imagen/`, {
      usuario_id,
    });
  }
}
