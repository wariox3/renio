import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { SubdominioService } from '@comun/services/subdominio.service';

export class Subdominio {
  urlSubDominio: string = environment.URL_API_SUBDOMINIO;
  empresaLocalhost: string = environment.EMPRESA_LOCALHOST;
  urlMuup: string = environment.URL_API_MUUP;
  subdominioService = inject(SubdominioService);

  constructor() {
    if (this.subdominioService.esSubdominioActual()) {
      this.urlSubDominio = this.urlSubDominio.replace(
        'subdominio',
        this.subdominioService.subdominioNombre()
      );
    } else {
      this.urlSubDominio = this.urlSubDominio.replace(
        'subdominio',
        this.empresaLocalhost
      );
    }
  }
}
