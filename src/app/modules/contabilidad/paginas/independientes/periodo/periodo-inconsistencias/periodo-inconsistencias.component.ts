import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ConPeriodo,
  PeriodoInconsistencia,
} from '@modulos/contabilidad/interfaces/contabilidad-periodo.interface';
import { PeriodoService } from '@modulos/contabilidad/servicios/periodo.service';

@Component({
  selector: 'app-periodo-inconsistencias',
  standalone: true,
  imports: [],
  templateUrl: './periodo-inconsistencias.component.html',
  styleUrl: './periodo-inconsistencias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoInconsistenciasComponent implements OnInit {
  private _periodoService = inject(PeriodoService);

  public inconsistencias = signal<PeriodoInconsistencia[]>([]);

  @Input() periodo: ConPeriodo;

  ngOnInit(): void {
    this._consultarInconsistencias(this.periodo.anio, this.periodo.mes);
  }

  private _consultarInconsistencias(anio: number, mes: number) {
    this._periodoService
      .consultarInconsistencias(anio, mes)
      .subscribe((response) => {
        this.inconsistencias.set(response.inconsistencia);
      });
  }
}
