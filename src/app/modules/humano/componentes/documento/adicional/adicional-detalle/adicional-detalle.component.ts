import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-adicional-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
  ],
  templateUrl: './adicional-detalle.component.html',
  styleUrl: './adicional-detalle.component.scss',
})
export default class AdicionalDetalleComponent extends General {
emitir() {
throw new Error('Method not implemented.');
}
imprimir() {
throw new Error('Method not implemented.');
}
aprobar() {
throw new Error('Method not implemented.');
}

  adicional: any = {
    contrato: '',
    concepto: '',
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
      .subscribe((respuesta: any) => {
        this.adicional = respuesta.documento;
        this.changeDetectorRef.detectChanges();
      });
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  navegarNuevo() {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/nuevo`], {
        queryParams: {
          documento_clase: parametro.documento_clase,
        },
      });
    });
  }

}
