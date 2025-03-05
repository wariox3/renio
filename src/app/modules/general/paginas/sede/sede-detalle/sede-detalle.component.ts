import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Sede } from '@modulos/general/interfaces/sede.interface';
import { NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { SedeService } from '@modulos/general/servicios/sede.service';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-sede-detalle',
  standalone: true,
  templateUrl: './sede-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownMenu,
    CardComponent,
    BtnAtrasComponent,
    NgxMaskDirective,
    NgxMaskPipe,
    TituloAccionComponent,
  ],
  providers: [provideNgxMask()],
})
export default class AsesorDetalleComponent extends General implements OnInit {
  sede: Sede = {
    nombre: '',
    grupo_nombre: '',
    grupo_id: 0,
  };

  constructor(private sedeService: SedeService) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.sedeService.consultarDetalle(this.detalle).subscribe((respuesta) => {
      this.sede = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
