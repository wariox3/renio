import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BaseLandingpageComponent } from '@comun/componentes/base-landingpage/base-landingpage.component';

@Component({
  selector: 'app-terminos',
  standalone: true,
  templateUrl: './terminos.component.html',
  imports: [
    BaseLandingpageComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
],
})
export class TerminosComponent {

}
