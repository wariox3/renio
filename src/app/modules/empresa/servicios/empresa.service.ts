import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private httpService: HttpService) { }

  consultarDetalle(id: string) {
    return this.httpService.get<any>(`general/empresa/${id}/`);
  }

  actualizarDatosEmpresa(id: number, data: any) {
    return this.httpService.put<any>(`general/empresa/${id}/`, data);
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.httpService.post<{ cargar: boolean, imagen: string }>(
      `general/empresa/cargar-logo/`,
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
    }>(`general/empresa/limpiar-logo/`, {
      empresa_id,
    });
  }

  activarEmpresa(empresa_id: Number | string,  data: any){
    return this.httpService.post('general/empresa/activar/', {
      empresa_id,
      webhookEmision: '123',
      webhookNotificacion: '123',
      ...data
    })
  }
}
