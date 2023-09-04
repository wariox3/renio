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
  protected modelo = '';
  protected tipo = '';
  protected formulario = '';
  protected accion = '';

  constructor() {
    this.modelo = this.activatedRoute.snapshot.queryParams['modelo'];
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    this.formulario = this.activatedRoute.snapshot.queryParams['formulario'];
    this.accion = this.activatedRoute.snapshot.queryParams['accion'];
  }
}
