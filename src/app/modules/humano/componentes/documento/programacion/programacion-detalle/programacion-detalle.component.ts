import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { ProgramacionService } from '@modulos/humano/servicios/programacion';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-programacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
  ],
  templateUrl: './programacion-detalle.component.html',
  styleUrl: './programacion-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  programacion: any = {
      "id": 0,
      "fecha_desde": "",
      "fecha_hasta": "",
      "fecha_hasta_periodo": "",
      "nombre": "",
      "cantidad": 0,
      "dias": 0,
      "descuento_pension": false,
      "descuento_salud": false,
      "descuento_fondo_solidaridad": false,
      "descuento_adicional_permanente": false,
      "descuento_adicional_programacion": false,
      "descuento_credito": false,
      "descuento_embargo": false,
      "descuento_retencion_fuente": false,
      "pago_auxilio_transporte": false,
      "pago_horas": false,
      "pago_incapacidad": false,
      "pago_licencia": false,
      "pago_vacacion": false,
  };

  constructor(
    private programacionService: ProgramacionService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.programacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.programacion = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  cargarContratos(){
    
  }
}
