import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { MovimientoService } from '@modulos/contabilidad/servicios/movimiento.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-movimiento-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent
],
  templateUrl: './movimiento-detalle.component.html',
})
export default class MovimientoDetalleComponent extends General implements OnInit {

  movimiento = {
    nombre: '',
  };

  constructor(private movimientoService: MovimientoService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.movimientoService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.movimiento = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
