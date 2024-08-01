import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-credito-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
  ],
  templateUrl: './credito-detalle.component.html',
  styleUrl: './credito-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  credito: any = {
    contrato: '',
    concepto: '',
  };

  // constructor(
  //   private creditoService: CreditoService
  // ) {
  //   super();
  //   this.consultardetalle();
  // }

  // consultardetalle() {
  //   this.creditoService
  //     .consultarDetalle(this.detalle)
  //     .subscribe((respuesta: any) => {
  //       this.credito = respuesta.documento;
  //       this.changeDetectorRef.detectChanges();
  //     });
  // }
}
