import { Injectable } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProvisionService extends Subdominio {
  constructor(private httpService: HttpService) {
    super();
  }

  actualizarProvision(id: number, data: { [string: string]: string }) {
    return this.httpService.patch<any>(
      `humano/configuracion_provision/${id}/`,
      data,
    );
  }
}
