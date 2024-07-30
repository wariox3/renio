import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Concepto } from '@interfaces/humano/Concepto';
import { ConceptoService } from '@modulos/humano/servicios/concepto.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-concepto-detalle',
  standalone: true,
  imports: [CommonModule, CardComponent, BtnAtrasComponent, TranslateModule],
  templateUrl: './concepto-detalle.component.html',
  styleUrl: './concepto-detalle.component.scss',
})
export default class ConceptoDetalleComponent
  extends General
  implements OnInit
{
  concepto: Concepto = {
    nombre: '',
    id: 0,
    porcentaje: '',
    ingreso_base_prestacion: false,
    ingreso_base_cotizacion: false,
    orden: 0
  };

  constructor(private conceptoService: ConceptoService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.conceptoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.concepto = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
