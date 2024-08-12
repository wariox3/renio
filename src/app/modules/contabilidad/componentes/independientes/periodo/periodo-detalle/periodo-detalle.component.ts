import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ConPeriodo } from '@interfaces/contabilidad/contabilidad-periodo.interface';
import { PeriodoService } from '@modulos/contabilidad/servicios/periodo.service';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-movimiento-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    BtnAtrasComponent,
    AsyncPipe,
  ],
  templateUrl: './periodo-detalle.component.html',
  styleUrl: './periodo-detalle.component.scss'
})
export class PeriodoDetalleComponent extends General implements OnInit {
  // periodos$: Observable<ConPeriodo[]>
  periodos: ConPeriodo[];
  fechas: number[];
  periodosFiltradosPorAnio: ConPeriodo[] = [];
  anioSeleccionado: number

  constructor(private periodoService: PeriodoService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  seleccionarAnio(anio: number) {
    this.anioSeleccionado = anio
    this.periodosFiltradosPorAnio = this.periodos.filter(
      (item) => item.anio === anio
    );
    this.changeDetectorRef.detectChanges();
  }

  deNumeroAMes(mes: number) {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return meses[mes-1] || meses[0] ;
  }

  consultarDetalle() {
    this.periodoService.consultarDetalle().pipe(
      map(respuesta => respuesta.sort((a, b) => b.anio - a.anio))
    ).subscribe((respuesta) => {
      this.periodos = respuesta;
      this.fechas = [...new Set(respuesta.map((item) => item.anio))];
      this.changeDetectorRef.detectChanges();
    });
  }
}
