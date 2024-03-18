import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Asesor } from '@interfaces/general/Asesor';
import { AsesorService } from '@modulos/general/servicios/asesor.service';
import { NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-asesor-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownMenu,
    CardComponent
  ],
  templateUrl: './asesor-detalle.component.html',
})
export default class AsesorDetalleComponent 
extends General implements OnInit 
{ 

  asesor: Asesor = {
    nombre_corto: '',
    celular: 0,
    correo: '',
  };

  constructor (private asesorService: AsesorService) {
    super();
  }

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle(){
    this.asesorService.consultarDetalle(this.detalle)
    .subscribe((respuesta) => {
      this.asesor = respuesta;
      this.changeDetectorRef.detectChanges();
    })
  }

}
