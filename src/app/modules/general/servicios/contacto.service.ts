import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Contacto } from '@interfaces/general/contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactoService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  guardarContacto(data: Contacto) {
    return this.httpService.post<Contacto>(`general/contacto/`, data);
  }

  consultarDetalle(id: number) {
    return this.httpService.getDetalle<Contacto>(`general/contacto/${id}/`);
  }

  actualizarDatosContacto(id: number, data: Contacto) {
    return this.httpService.put<Contacto>(`general/contacto/${id}/`, data);
  }

  validarNumeroIdentificacion(data: {
    identificacion_id: number;
    numero_identificacion: string;
  }) {
    return this.httpService.post<{ validacion: boolean; codigo: number }>(
      `general/contacto/validar/`,
      data
    );
  }
}
