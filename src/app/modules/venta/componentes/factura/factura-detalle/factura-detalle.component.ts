import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { documentosEstadosAction } from '@redux/actions/documentosEstadosAction';
import { CardComponent } from "@comun/componentes/card/card.component";
import { BotoneraDetalleComponent } from "@comun/componentes/botonera-detalle/botonera-detalle.component";

@Component({
    selector: 'app-factura-detalle',
    standalone: true,
    templateUrl: './factura-detalle.component.html',
    styleUrls: ['./factura-detalle.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        TranslationModule,
        NgbDropdownModule,
        NgbNavModule,
        TablaComponent,
        ImpuestosComponent,
        ProductosComponent,
        BuscarAvanzadoComponent,
        SoloNumerosDirective,
        CardComponent,
        BotoneraDetalleComponent
    ]
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
    impuestos: []
  };
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  arrEstados = {
    estado_aprobado: false
  };
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  constructor(private facturaService: FacturaService) {
    super();
    this.consultardetalle();
  }


  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.documento = respuesta.documento;
        this.arrEstados = {
          estado_aprobado: respuesta.documento.estado_aprobado,
        }
        this.changeDetectorRef.detectChanges();
      });
  }
}
