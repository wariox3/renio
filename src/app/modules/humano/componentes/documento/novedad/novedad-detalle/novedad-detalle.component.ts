import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { NovedadService } from '@modulos/humano/servicios/novedad.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-novedad-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent
],
  templateUrl: './novedad-detalle.component.html',
  styleUrl: './novedad-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  novedad: any = {
      "id": 0,
      "fecha_desde": "",
      "fecha_hasta": "",
      "contrato_contacto_nombre_corto": "",
      "contrato_contacto_numero_identificacion": ""
  };

  constructor(
    private novedadService: NovedadService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.novedadService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.novedad = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
