import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-novedad-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
  ],
  templateUrl: './novedad-detalle.component.html',
  styleUrl: './novedad-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  credito: any = {
      "id": 0,
      "fecha_inicio": "",
      "total": 0,
      "cuota": 0,
      "cantidad_cuotas": 0,
      "validar_cuotas": false,
      "contrato": 0
  };

  constructor(
    private creditoService: CreditoService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.creditoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.credito = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
