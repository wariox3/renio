import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contrato-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    BtnAtrasComponent,
    TranslateModule,
],
  templateUrl: './contrato-detalle.component.html',
  styleUrls: ['./contrato-detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoDetalleComponent
  extends General
  implements OnInit
{
  constructor(private contratoService: ContratoService) {
    super();
  }

  contrato: any = {
    empleado: '',
    empleado_nombre: '',
    fecha_desde: '',
    fechas_hasta: '',
  };

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.contratoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.contrato = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
