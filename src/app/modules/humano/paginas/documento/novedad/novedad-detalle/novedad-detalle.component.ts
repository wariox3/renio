import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { NovedadService } from '@modulos/humano/servicios/novedad.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { Novedad } from '@modulos/humano/interfaces/novedad.interface';

@Component({
  selector: 'app-novedad-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent,
  ],
  templateUrl: './novedad-detalle.component.html',
  styleUrl: './novedad-detalle.component.scss',
})
export default class CreditoDetalleComponent extends General {
  novedad: Novedad = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    contrato_contacto_nombre_corto: '',
    contrato_contacto_numero_identificacion: '',
    fecha_desde_periodo: '',
    fecha_hasta_periodo: '',
    fecha_desde_empresa: undefined,
    fecha_hasta_empresa: undefined,
    fecha_desde_entidad: undefined,
    fecha_hasta_entidad: undefined,
    dias_disfrutados: 0,
    dias_disfrutados_reales: 0,
    dias_dinero: 0,
    dias: 0,
    dias_empresa: 0,
    dias_entidad: 0,
    pago_disfrute: 0,
    pago_dinero: 0,
    pago_dia_disfrute: 0,
    pago_dia_dinero: 0,
    base_cotizacion_propuesto: 0,
    base_cotizacion: 0,
    hora_empresa: 0,
    hora_entidad: 0,
    pago_empresa: 0,
    pago_entidad: 0,
    total: 0,
    contrato_id: 0,
    contrato_contacto_id: 0,
    novedad_tipo_id: 0,
    novedad_tipo_nombre: '',
    novedad_referencia_id: 0,
  };

  constructor(private novedadService: NovedadService) {
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
