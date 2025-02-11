import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { Sucursal } from '@modulos/humano/interfaces/Sucursal';
import { SucursalService } from '@modulos/humano/servicios/Sucursal.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sucursal-detalle',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardComponent, BtnAtrasComponent, TituloAccionComponent],

  templateUrl: './sucursal-detalle.component.html',
})
export default class SucursalDetalleComponent extends General implements OnInit {
  sucursal: Sucursal = {
    nombre: '',
    id: 0,
    codigo: ''
  };

  private _sucursalService = inject(SucursalService);

  constructor() {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this._sucursalService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.sucursal = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

 }
