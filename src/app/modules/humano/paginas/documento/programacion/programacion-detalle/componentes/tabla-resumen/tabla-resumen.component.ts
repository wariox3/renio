import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { AnimacionFadeInOutDirective } from '@comun/directive/animacion-fade-in-out.directive';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@Component({
  selector: 'app-tabla-resumen',
  standalone: true,
  imports: [
    AnimacionFadeInOutDirective,
    CommonModule,
    KeeniconComponent,
    TranslateModule,
  ],
  templateUrl: './tabla-resumen.component.html',
})
export class TablaResumenComponent {
  mostrarMasDetalles = signal(false);

  @Input() programacion: any = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    nombre: '',
    cantidad: 0,
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
  };

  mostrarTodosLosDetalles() {
    this.mostrarMasDetalles.update(
      (mostrarMasDetalles) => (mostrarMasDetalles = !mostrarMasDetalles)
    );

    console.log(this.mostrarMasDetalles());

  }
}
