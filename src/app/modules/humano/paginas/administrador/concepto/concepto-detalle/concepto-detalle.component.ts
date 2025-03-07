import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Concepto } from '@modulos/contenedor/interfaces/concepto.interface';
import { ConceptoService } from '@modulos/humano/servicios/concepto.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-concepto-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    BtnAtrasComponent,
    TranslateModule,
    TituloAccionComponent,
  ],
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
    orden: 0,
    concepto_tipo_id: 0,
    concepto_tipo_nombre: '',
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
        this.concepto.porcentaje = `${parseFloat(respuesta.porcentaje.replace(',', '.'))}`;
        this.changeDetectorRef.detectChanges();
      });
  }
}
