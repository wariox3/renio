import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CuentaService } from '@modulos/contabilidad/servicios/cuenta.service';

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
export default class CuentaDetalleComponent extends General implements OnInit {
  cuenta: any = {
    nombre: '',
    id: 0,
    codigo: null,
  };
  @Input() informacionFormulario: any;

  constructor(private cuentaService: CuentaService) {
    super();
  }
  ngOnInit() {    
    this.consultardetalle();
  }

  consultardetalle() {
    this.cuentaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.cuenta = respuesta; 
        this.changeDetectorRef.detectChanges();
      });
  }
  
}
