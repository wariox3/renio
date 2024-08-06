import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ComprobanteService } from '@modulos/contabilidad/servicios/comprobante.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comprobante-detalle',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardComponent, BtnAtrasComponent],
  templateUrl: './comprobante-detalle.component.html',
  styleUrl: './comprobante-detalle.component.scss',
})
export default class ComprobanteDetalleComponent  extends General implements OnInit {

  comprobante = {
    nombre: '',
  };

  constructor(private comprobanteServicio: ComprobanteService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.comprobanteServicio.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.comprobante = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

}
