import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Asesor } from '@modulos/general/interfaces/asesor.interface';
import { AsesorService } from '@modulos/general/servicios/asesor.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-asesor-detalle',
  standalone: true,
  templateUrl: './asesor-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgxMaskPipe,
    TituloAccionComponent
],
  providers: [provideNgxMask()],
})
export default class AsesorDetalleComponent extends General implements OnInit {
  asesor: Asesor = {
    nombre_corto: '',
    celular: 0,
    correo: '',
  };

  constructor(private asesorService: AsesorService) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.asesorService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.asesor = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
