import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';

@Component({
  selector: 'app-documento-soporte-detalle',
  standalone: true,
  templateUrl: './documento-soporte-detalle.component.html',
  styleUrls: ['./documento-soporte-detalle.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    TablaComponent,
    ImpuestosComponent,
    ProductosComponent,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
    CardComponent,
    BtnAtrasComponent,
],
})
export default class FacturaDetalleComponent extends General {
  active: Number;
  documento: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
    impuestos: [],
  };
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  arrEstados = {
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
  };
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.documento = respuesta.documento;

        respuesta.documento.detalles.map((item: any) => {
          const cantidad = item.cantidad;
          const precio = item.precio;
          const porcentajeDescuento = item.descuento;
          const total = item.total;
          let subtotal = cantidad * precio;
          let descuento = (porcentajeDescuento * subtotal) / 100;
          let subtotalFinal = subtotal - descuento;

          const impuestos = item.impuestos;
          impuestos.forEach((impuesto: any) => {
            this.totalImpuestos += impuesto.total;
          });

          let neto = item.neto || 0;

          this.totalCantidad += parseInt(item.cantidad);
          this.totalDescuento += descuento;
          this.subtotalGeneral += subtotalFinal;
          this.totalNetoGeneral += neto;
          this.totalGeneral += total;
          this.changeDetectorRef.detectChanges();
        });
        this.arrEstados = {
          estado_aprobado: respuesta.documento.estado_aprobado,
          estado_anulado: respuesta.documento.estado_anulado,
          estado_electronico: respuesta.documento.estado_electronico,
          estado_electronico_enviado:
            respuesta.documento.estado_electronico_enviado,
          estado_electronico_notificado:
            respuesta.documento.estado_electronico_notificado,
        };
        this.changeDetectorRef.detectChanges();
      });
  }

  aprobar() {
    this.httpService
      .post('general/documento/aprobar/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Documento aprobado');
      });
  }

  emitir() {
    this.httpService
      .post('general/documento/emitir/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
        this.consultardetalle();
      });
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 11,
      documento_id: this.detalle,
    });
  }
}
