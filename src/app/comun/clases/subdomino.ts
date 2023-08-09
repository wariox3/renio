import { inject } from "@angular/core";
import { environment } from "@env/environment";
import { Store } from "@ngrx/store";
import { obtenerEmpresaSubdominio } from "@redux/selectors/empresa.selectors";
import { SubdominioService } from "@comun/services/subdominio.service";

export class Subdomino {

  urlSubDominio: string = environment.URL_API_SUBDOMINIO;
  empresaLocalhost: string = environment.EMPRESA_LOCALHOST;
  urlMuup: string = environment.URL_API_MUUP;
  empresaSubdominio$ = inject(Store).select(obtenerEmpresaSubdominio)
  subdominioService = inject(SubdominioService)

  constructor() {
    this.empresaSubdominio$.subscribe((empresaSubdominio) => {
      if(this.subdominioService.esSubdominioActual()){
        this.urlSubDominio = this.urlSubDominio.replace('subdominio', empresaSubdominio);
      } else {
        this.urlSubDominio = this.urlSubDominio.replace('subdominio', this.empresaLocalhost);
      }
    });
  }
}
