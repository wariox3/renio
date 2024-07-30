import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Grupo } from '@interfaces/humano/Grupo';
import { GrupoService } from '@modulos/humano/servicios/grupo.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-grupo-detalle',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
  ],
  templateUrl: './grupo-detalle.component.html',
  styleUrl: './grupo-detalle.component.scss',
})
export default class GrupoDetalleComponent   extends General
implements OnInit {

  grupo: Grupo = {
    nombre: '',
  };

  constructor(private grupoService: GrupoService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.grupo = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
