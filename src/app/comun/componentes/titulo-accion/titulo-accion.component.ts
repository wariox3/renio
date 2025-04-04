import { LowerCasePipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-titulo-accion',
  standalone: true,
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, TranslateModule],
  templateUrl: './titulo-accion.component.html',
})
export class TituloAccionComponent extends General implements OnInit {
  private readonly _configModuleService = inject(ConfigModuleService);

  @Input({ required: true }) nombreModelo: string;

  ngOnInit(): void {}
}
