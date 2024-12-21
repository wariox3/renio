import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { GrupoService } from '@modulos/contabilidad/servicios/grupo.service';
import { ConGrupo } from '@modulos/contabilidad/interfaces/contabilidad-grupo.interface';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-grupo-detalle',
  standalone: true,
  templateUrl: './grupo-detalle.component.html',
  styleUrl: './grupo-detalle.component.scss',
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
})
export default class GrupoDetalleComponent extends General implements OnInit {
  conGrupo: ConGrupo = {
    id: 0,
    nombre: '',
    codigo: null,
  };
  @Input() informacionFormulario: any;

  constructor(private grupoService: GrupoService) {
    super();
  }
  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: ConGrupo) => {
        this.conGrupo = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
