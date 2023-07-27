import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';


@Component({
  selector: 'app-comun-base-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss']
})
export class BaseListaComponent {}
