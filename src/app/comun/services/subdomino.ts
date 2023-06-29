import { inject } from "@angular/core";
import { environment } from "@env/environment";
import { Store } from "@ngrx/store";
import { obtenerEmpresaNombre } from "@redux/selectors/empresa-nombre.selectors";

export class Subdomino {

  urlSubDominio: string = environment.URL_API_SUBDOMINIO;
  usuarioEmpresaNombre$ = inject(Store).select(obtenerEmpresaNombre)

  constructor() {
    this.usuarioEmpresaNombre$.subscribe((empresaNombre) => {
      this.urlSubDominio = this.urlSubDominio.replace('subdominio', empresaNombre);
    });
  }
}
