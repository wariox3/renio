import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';

@Component({
  selector: 'app-cuenta-detalle',
  standalone: true,
  templateUrl: './cuenta-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    BtnAtrasComponent,
],
})
export default class ItemDetalleComponent extends General implements OnInit {
  arrImpuestosEliminado: number[] = [];
  item: any = {
    nombre: '',
    id: 0,
    impuestos: [],
    codigo: null,
    referencia: null,
    costo: 0,
    precio: 0,
    base: 0,
    porcentaje: 0,
    total: 0,
    nombre_extendido: '',
    porcentaje_total: 0,
    venta: false,
    compra: false,
  };
  @Input() informacionFormulario: any;
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(private itemService: ItemService) {
    super();
  }
  ngOnInit() {    
    this.consultardetalle();
  }

  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.item = respuesta.item; 
        this.changeDetectorRef.detectChanges();
      });
  }
  
  get impuestosVenta() {
    return this.item.impuestos.filter((impuesto: any) => impuesto.impuesto_venta);
  }

  get impuestosCompra() {
    return this.item.impuestos.filter((impuesto: any) => impuesto.impuesto_compra);
  }
}
