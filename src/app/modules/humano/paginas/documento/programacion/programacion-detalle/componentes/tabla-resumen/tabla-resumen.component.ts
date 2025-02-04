import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { TranslateModule } from '@ngx-translate/core';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@Component({
  selector: 'app-tabla-resumen',
  standalone: true,
  imports: [
    AnimacionFadeInOutDirective,
    CommonModule,
    KeeniconComponent,
    TranslateModule,
    SiNoPipe
  ],
  templateUrl: './tabla-resumen.component.html',
})
export class TablaResumenComponent {
  mostrarMasDetalles = signal(false);

  @Input() programacion: ProgramacionRespuesta = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    nombre: '',
    dias: 0,
    total: 0,
    descuento_pension: false,
    descuento_salud: false,
    descuento_fondo_solidaridad: false,
    adicional: false,
    descuento_credito: false,
    descuento_embargo: false,
    descuento_retencion_fuente: false,
    pago_auxilio_transporte: false,
    pago_horas: false,
    pago_incapacidad: false,
    pago_licencia: false,
    pago_vacacion: false,
    estado_generado: false,
    estado_aprobado: false,
    devengado: 0,
    deduccion: 0,
    contratos: 0,
    comentario: undefined,
    pago_tipo_id: 0,
    pago_tipo_nombre: '',
    grupo_id: 0,
    grupo_nombre: '',
    periodo_id: 0,
    periodo_nombre: '',
    pago_prima: false,
    pago_interes: false,
    pago_cesantia: false
  };

  mostrarTodosLosDetalles() {
    this.mostrarMasDetalles.update(
      (mostrarMasDetalles) => (mostrarMasDetalles = !mostrarMasDetalles)
    );
  }
}
