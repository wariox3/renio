import { ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { TranslateService } from '@ngx-translate/core';

export class Base {
  private readonly _configModuleService = inject(ConfigModuleService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private _modulo: string | null;
  protected alertaService = inject(AlertaService);
  protected translateService = inject(TranslateService);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  public detalle: number;

  constructor() {
    this._setupConfigModuleListener();
    this._setupActivatedRouteListener();
  }

  private _setupConfigModuleListener() {
    this._configModuleService.currentModelConfig$.subscribe((value) => {
      this._modulo = this._configModuleService.modulo();
    });
  }

  private _setupActivatedRouteListener() {
    this.activatedRoute.queryParams.subscribe((parametros) => {
      const detalleId = this.activatedRoute.snapshot.paramMap.get('id');

      if (detalleId) {
        this.detalle = Number(detalleId);
      }
    });
  }

  navigateNuevo() {
    console.log(this._modulo);
    console.log(this.detalle);
  }

  navigateEditar(id: number) {
    console.log(this._modulo);
    console.log(id);
  }
}
