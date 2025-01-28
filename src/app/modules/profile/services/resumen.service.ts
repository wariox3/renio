import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FechasService } from '@comun/services/fechas.service';
import { environment } from '@env/environment';
import { enviarDatosUsuario } from '../interfaces/enviar-datos-usuario.interface';
import { Consumos, Facturas } from '@interfaces/facturacion/Facturacion';
import { UsuarioInformacionPerfil } from '../interfaces/usuario-Informacion-perfil';

@Injectable({
  providedIn: 'root',
})
export class ResumenService {
  constructor(private http: HttpClient, private fechaServices: FechasService) {}

  perfil(codigoUsuario: string) {
    return this.http.get<UsuarioInformacionPerfil>(
      `${environment.URL_API_MUUP}/seguridad/usuario/${codigoUsuario}/`
    );
  }

  actualizarInformacion(data: enviarDatosUsuario) {
    return this.http.put<UsuarioInformacionPerfil>(
      `${environment.URL_API_MUUP}/seguridad/usuario/${data.id}/`,
      {
        nombre: data.nombre,
        apellido: data.apellido,
        nombre_corto: data.nombreCorto,
        telefono: data.telefono,
        idioma: data.idioma,
        cargo:  data.cargo,
        numero_identificacion:  data.numero_identificacion,
      }
    );
  }

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
        fechaHasta: fechaHasta,
      }
    );
  }

  cargarImagen(usuario_id: Number | string, imagenB64: string) {
    return this.http.post<{
      cargar: boolean;
      imagen: string;
    }>(`${environment.URL_API_MUUP}/seguridad/usuario/cargar-imagen/`, {
      usuario_id,
      imagenB64,
    });
  }

  eliminarImagen(usuario_id: Number | string) {
    return this.http.post<{
      limpiar: boolean;
      imagen: string;
    }>(`${environment.URL_API_MUUP}/seguridad/usuario/limpiar-imagen/`, {
      usuario_id,
    });
  }
}
