import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { SubdominioService } from '@comun/services/subdominio.service';
import { Store } from '@ngrx/store';
import { obtenerContenedorSubdominio } from '@redux/selectors/contenedor.selectors';

export class Subdominio {
  private readonly _store = inject(Store);

  private readonly BASE_API = environment.URL_API_SUBDOMINIO;
  protected API_SUBDOMINIO: string = environment.URL_API_SUBDOMINIO;
  protected EMPRESA_SUBDOMINIO: string;

  // TODO: refactor
  empresaLocalhost: string = environment.EMPRESA_LOCALHOST;
  urlMuup: string = environment.URL_API_MUUP;
  subdominioService = inject(SubdominioService);

  constructor() {
    this._store.select(obtenerContenedorSubdominio).subscribe((respuesta) => {
      this.API_SUBDOMINIO = this.BASE_API.replace('subdominio', respuesta);
      this.EMPRESA_SUBDOMINIO = respuesta;
    });
  }
}

