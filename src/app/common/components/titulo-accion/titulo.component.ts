import { LowerCasePipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-titulo',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, TranslateModule],
  templateUrl: './titulo.component.html',
})
export class TituloComponent {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  @Input({ required: true }) titulo: string;

  accion: string | null = null;

  constructor() {
    this._activatedRoute.queryParams.subscribe(() => {
      const url = this._router.url;
      if (url.includes('/nuevo')) this.accion = 'nuevo';
      else if (url.includes('/detalle')) this.accion = 'detalle';
      else if (url.includes('/editar')) this.accion = 'editar';
    });
  }
}