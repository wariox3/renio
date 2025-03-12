import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ActivoService } from '@modulos/contabilidad/servicios/activo.service';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-activo-detalle',
  standalone: true,
  templateUrl: './activo-detalle.component.html',
  styleUrl: './activo-detalle.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent,
  ],
})
export default class GrupoDetalleComponent extends General implements OnInit {
  conActivo: any = {
    id: 0,
    nombre: '',
    codigo: null,
  };
  @Input() informacionFormulario: any;

  constructor(private _activoService: ActivoService) {
    super();
  }
  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this._activoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.conActivo = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
