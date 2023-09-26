import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private httpService: HttpService) { }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/documento/${id}/`);
  }

  actualizarDatosEmpresa(id: number, data: any) {
    return this.httpService.put<any>(`general/documento/${id}/`, data);
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.httpService.post<{ cargar: boolean }>(
      `/contenedor/contenedor/cargar-logo/`,
      {
        empresa_id,
        imagenB64,
      }
    );
  }

  eliminarLogoEmpresa(empresa_id: Number | string) {
    return this.httpService.post<{
      limpiar: boolean;
      imagen: string;
    }>(`contenedor/contenedor/limpiar-logo/`, {
      empresa_id,
    });
  }

}
