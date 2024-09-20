import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ProgramacionContrato } from '@interfaces/humano/contrato';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contrato-detalle',
  standalone: true,
  imports: [CommonModule, CardComponent, BtnAtrasComponent, TranslateModule],
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

  contrato: ProgramacionContrato = {
    id: 1,
    fecha_desde: new Date(),
    fecha_hasta: new Date(),
    salario: 0,
    auxilio_transporte: false,
    salario_integral: false,
    estado_terminado: false,
    comentario: '',
    contrato_tipo_id: 0,
    contrato_tipo_nombre: '',
    grupo_id: 0,
    grupo_nombre: '',
    contacto_id: 0,
    contacto_numero_identificacion: '',
    contacto_nombre_corto: '',
    sucursal_id: 0,
    sucursal_nombre: '',
    riesgo_id: 0,
    riesgo_nombre: '',
    cargo_id: 0,
    cargo_nombre: '',
    tipo_cotizante_id: 0,
    tipo_cotizante_nombre: '',
    subtipo_cotizante_id: 0,
    subtipo_cotizante_nombre: '',
    salud_id: 0,
    salud_nombre: '',
    pension_id: 0,
    pension_nombre: '',
    ciudad_contrato: 0,
    ciudad_contrato_nombre: '',
    ciudad_labora: 0,
    ciudad_labora_nombre: '',
    entidad_caja_id: 0,
    entidad_caja_nombre: '',
    entidad_cesantias_id: 0,
    entidad_cesantias_nombre: '',
    entidad_pension_id: 0,
    entidad_pension_nombre: '',
    entidad_salud_id: 0,
    entidad_salud_nombre : ''
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
