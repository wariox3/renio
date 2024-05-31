import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BtnwhatsappComponent } from '../../comun/componentes/btnwhatsapp/btnwhatsapp.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { BaseLandingpageComponent } from '@comun/componentes/base-landingpage/base-landingpage.component';

@Component({
  selector: 'app-contruccion',
  standalone: true,
  templateUrl: './contruccion.component.html',
  imports: [
    BaseLandingpageComponent,
    CommonModule,
    BtnwhatsappComponent,
    RouterModule,
    TranslateModule,
    TranslationModule,
  ],
})
export class ContruccionComponent {

}
