import { ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

export class General {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected store = inject(Store);
  protected alertaService = inject(AlertaService);
  protected translateService = inject(TranslateService);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  protected modulo = '';
  protected modelo = '';
  protected tipo = '';
  protected formulario = '';
  protected accion = '';
  protected detalle = 0;

  constructor() {
    this.consultarParametros();
  }

  consultarParametros() {
    if (this.router.url.includes('nuevo')) {
      this.accion = 'nuevo';
    } else {
      this.accion = 'detalle';
    }

    const cambiosQueryParams = this.activatedRoute.queryParams.subscribe(
      (queryParam) => {
        this.modulo = queryParam['modulo'];
        this.modelo = queryParam['modelo'];
        this.tipo = queryParam['tipo'];
        this.detalle = queryParam['detalle'];
        this.changeDetectorRef.detectChanges
      }
    );

    cambiosQueryParams.unsubscribe();
  }
}
