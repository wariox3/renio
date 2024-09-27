import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { MovimientoBalancePrueba } from '@interfaces/contabilidad/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { map, Observable, tap } from 'rxjs';

interface DataAgrupada {
  [cuentaClaseId: number]: {
    [cuentaGrupoId: number]: {
      [cuentaSubcuentaId: number | string]: {
        vr_debito: number;
        vr_credito: number;
      };
    };
  };
}

@Component({
  selector: 'app-balance-prueba',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './balance-prueba.component.html',
  styleUrl: './balance-prueba.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalancePruebaComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  public cuentasAgrupadas$: Observable<DataAgrupada>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarInformes();
  }

  private consultarInformes() {
    this.cuentasAgrupadas$ = this.contabilidadInformesService
      .consultarBalances()
      .pipe(
        map((response) => {
          return this.groupData(response.movimientos);
        }),
      );
  }

  private groupData(data: MovimientoBalancePrueba[]): DataAgrupada {
    return data.reduce((acc, record) => {
      const { cuenta_clase_id, cuenta_grupo_id, cuenta_cuenta_id } = record;

      if (!acc[cuenta_clase_id]) {
        acc[cuenta_clase_id] = {};
      }

      if (!acc[cuenta_clase_id][cuenta_grupo_id]) {
        acc[cuenta_clase_id][cuenta_grupo_id] = {};
      }

      if (!acc[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id]) {
        acc[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id] = {
          vr_debito: 0,
          vr_credito: 0,
        };
      }

      if (!acc[cuenta_clase_id][cuenta_grupo_id]['total']) {
        acc[cuenta_clase_id][cuenta_grupo_id]['total'] = {
          vr_debito: 0,
          vr_credito: 0,
        };
      }

      acc[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id].vr_debito +=
        record.vr_debito ?? 0;
      acc[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id].vr_credito +=
        record.vr_credito ?? 0;

      acc[cuenta_clase_id][cuenta_grupo_id]['total'].vr_debito +=
        record.vr_debito ?? 0;
      acc[cuenta_clase_id][cuenta_grupo_id]['total'].vr_credito +=
        record.vr_credito ?? 0;

      return acc;
    }, {} as DataAgrupada);
  }
}
