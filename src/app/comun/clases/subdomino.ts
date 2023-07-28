import { inject } from "@angular/core";
import { environment } from "@env/environment";
import { Store } from "@ngrx/store";
import { obtenerEmpresaNombre } from "@redux/selectors/empresa.selectors";
import { General } from "./general";
import { SubdominioService } from "@comun/services/subdominio.service";

export class Subdomino {

  urlSubDominio: string = environment.URL_API_SUBDOMINIO;
  empresaLocalhost: string = environment.EMPRESA_LOCALHOST;
  urlMuup: string = environment.URL_API_MUUP;
  usuarioEmpresaNombre$ = inject(Store).select(obtenerEmpresaNombre)
  SubdominioService = inject(SubdominioService)

  constructor() {
    this.usuarioEmpresaNombre$.subscribe((empresaNombre) => {
      if(this.SubdominioService.esSubdominioActual()){
        this.urlSubDominio = this.urlSubDominio.replace('subdominio', empresaNombre);
      } else {
        this.urlSubDominio = this.urlSubDominio.replace('subdominio', this.empresaLocalhost);
      }
    });
  }
}
