import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Precio } from '@interfaces/general/Precio';
import { PrecioService } from '@modulos/general/servicios/precio.service';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { BtnAtrasComponent } from "@comun/componentes/btn-atras/btn-atras.component";

@Component({
    selector: 'app-precio-detalle',
    standalone: true,
    templateUrl: './precio-detalle.component.html',
    imports: [CommonModule, TranslateModule, TranslationModule, CardComponent, BtnAtrasComponent]
})
export default class PrecioDetalleComponent extends General implements OnInit {
  precio: Precio = {
    id: 0,
    tipo: '',
    fecha_vence: undefined,
    nombre: ''
  };

  constructor(private precioService: PrecioService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.precio = respuesta
        this.changeDetectorRef.detectChanges();
      });
  }
}
