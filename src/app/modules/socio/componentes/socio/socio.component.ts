import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';

@Component({
  selector: 'app-socio',
  standalone: true,
  templateUrl: './socio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent
  ],

})
export class SocioComponent extends General implements OnInit {
  constructor(

  ) {
    super();
  }



  ngOnInit() {

  }
}
