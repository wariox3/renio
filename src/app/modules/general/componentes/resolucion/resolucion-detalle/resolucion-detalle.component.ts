import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';

@Component({
  selector: 'app-resolucion-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
  ],
  templateUrl: './resolucion-detalle.component.html',
  styleUrls: ['./resolucion-detalle.component.scss'],
})
export default class ResolucionNuevoComponent
  extends General
  implements OnInit
{
  resolucion: any;

  constructor(private resolucionService: ResolucionService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.resolucionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.resolucion = respuesta
        this.changeDetectorRef.detectChanges();
      });
  }
}
