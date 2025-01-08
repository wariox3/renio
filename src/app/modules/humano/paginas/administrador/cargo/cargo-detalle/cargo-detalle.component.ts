import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Cargo } from '@modulos/humano/interfaces/cargo.interface';
import { CargoService } from '@modulos/humano/servicios/cargo.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-cargo-detalle',
  standalone: true,
  imports: [CommonModule, CardComponent, BtnAtrasComponent, TranslateModule, TituloAccionComponent],
  templateUrl: './cargo-detalle.component.html',
  styleUrl: './cargo-detalle.component.scss',
})
export default class CargoDetalleComponent extends General implements OnInit {

  cargo: Cargo = {
    nombre: '',
    id: 0,
    estado_inactivo: false,
    codigo: 0
  };

  constructor(private cargoService: CargoService) {
    super();
  }


  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.cargoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.cargo = respuesta
        this.changeDetectorRef.detectChanges();
      });
  }
}
