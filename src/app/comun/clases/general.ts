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
  protected accion: string | null = null;
  protected detalle = 0;
  protected parametrosUrl: any = {};
  protected ubicacion: 'documento' | 'administrador' | 'utilidad' | 'informe';

  constructor() {
    this.consultarParametros();
  }

  consultarParametros() {
    switch (true) {
      case this.router.url.includes('documento'):
        this.ubicacion = 'documento';
        break;
      case this.router.url.includes('administrador'):
        this.ubicacion = 'administrador';
        break;
      case this.router.url.includes('utilidad'):
        this.ubicacion = 'utilidad';
        break;
      case this.router.url.includes('informe'):
        this.ubicacion = 'informe';
        break;
    }

    if (this.router.url.includes('nuevo')) {
      this.accion = 'nuevo';
    } else if (this.router.url.includes('detalle')) {
      this.accion = 'detalle';
    }

    this.activatedRoute.queryParams.subscribe((parametros) => {
      this.parametrosUrl = parametros;
      if (localStorage.getItem('itemNombre')) {
        this.modelo = localStorage.getItem('itemNombre')!;
      }
      this.detalle = parametros.detalle;
      this.changeDetectorRef.detectChanges;
    });
    this.changeDetectorRef.detectChanges;
    //cambiosQueryParams.unsubscribe();
  }
}
