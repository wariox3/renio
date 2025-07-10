import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../../comun/componentes/titulo-accion/titulo-accion.component";
import { Adicional } from '@modulos/humano/interfaces/adicional.interface';

@Component({
  selector: 'app-adicional-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent
],
  templateUrl: './adicional-detalle.component.html',
  styleUrl: './adicional-detalle.component.scss',
})
export default class AdicionalDetalleComponent extends General {
  adicional: Adicional = {
    id: 0,
    valor: 0,
    horas: 0,
    aplica_dia_laborado: false,
    detalle: null,
    concepto: 0,
    contrato: 0,
    programacion: null,
    permanente: false,
    inactivo: false,
    concepto__nombre: '',
    contrato__contacto__numero_identificacion: '',
    contrato__contacto__nombre_corto: '',
    contrato__contacto_id: '',
    concepto_id: 0
  };

  constructor(
    private httpService: HttpService,
    private adicionalService: AdicionalService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.adicionalService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.adicional = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  navegarEditar(id: number) {
    this.router.navigate([`humano/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`humano/documento/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }
}
