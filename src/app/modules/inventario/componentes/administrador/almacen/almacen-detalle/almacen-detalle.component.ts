import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AlmacenService } from '@modulos/inventario/service/almacen.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-almacen-detalle',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardComponent, BtnAtrasComponent, TituloAccionComponent],
  templateUrl: './almacen-detalle.component.html',
  styleUrl: './almacen-detalle.component.scss',
})
export default class AlmacenDetalleComponent  extends General implements OnInit {
  almacen = {
    nombre: '',
  };
  constructor(private almacenService: AlmacenService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.almacenService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.almacen = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
