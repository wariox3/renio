import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { DocumentoTipo } from '@interfaces/empresa/documentoTipo';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private httpService: HttpService) {}

  consultarDetalle(id: string) {
    return this.httpService.get<any>(`general/empresa/${id}/`);
  }

  actualizarDatosEmpresa(id: number, data: any) {
    return this.httpService.put<any>(`general/empresa/${id}/`, data);
  }

  cargarLogo(empresa_id: Number | string, imagenB64: string) {
    return this.httpService.post<{ cargar: boolean; imagen: string }>(
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

  reddocActivar(empresa_id: Number | string, data: any) {
    return this.httpService.post('general/empresa/rededoc_activar/', {
      empresa_id,
      ...data,
    });
  }

  reddocDetalle(empresa_id: Number | string) {
    return this.httpService.post('general/empresa/rededoc_detalle/', {
      empresa_id,
    });
  }

  reddocActualizar(empresa_id: Number | string, data: any) {
    return this.httpService.post('general/empresa/rededoc_actualizar/', {
      empresa_id,
      ...data,
    });
  }

  obtenerConfiguracionEmpresa(empresa_id: Number | string) {
    return this.httpService.get(`general/configuracion/${empresa_id}/`);
  }

  configuracionEmpresa(empresa_id: Number | string, data: any) {
    return this.httpService.put(`general/configuracion/${empresa_id}/`, {
      ...data,
    });
  }

  obtenerDocumentoTipo() {
    return this.httpService.get<DocumentoTipo>(`general/documento_tipo/`);
  }

  actualizarDocumentoTipo(documento_tipo_id: Number | string, data: any) {
    return this.httpService.put(
      `general/documento_tipo/${documento_tipo_id}/`,
      {
        ...data,
      }
    );
  }

  consultarDocumentoTipoDetalle(documento_tipo_id: Number | string) {
    return this.httpService.getDetalle(
      `general/documento_tipo/${documento_tipo_id}/`
    );
  }

  consultarDocumentoTipoUno() {
    return this.httpService.getDetalle<DocumentoTipo>(
      `general/documento_tipo/1/`
    );
  }

  asignarResolucionDocumentoTipo(resolucion_id: number) {
    return this.httpService.post(`general/documento_tipo/asignar-resolucion/`, {
      resolucion_id,
    });
  }

  finalizarProceso() {
    return this.httpService.post<{ asistente_termiando: boolean }>(
      'general/empresa/terminar-asistente/',
      null
    );
  }
}
