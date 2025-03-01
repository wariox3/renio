import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-detalles-totales',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './detalles-totales.component.html',
  styleUrl: './detalles-totales.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallesTotalesComponent implements OnChanges {
  @Input() detalles: any[];
  @Input() totalBase: number;
  @Input() totalCantidad: number;
  @Input() totalDescuento: number;
  @Input() totalImpuestos: number;
  @Input() totalGeneral: number;
  @Input() totalAfectado: number;
  @Input() subtotalGeneral: number;
  @Input() totalDebitos: number;
  @Input() totalCreditos: number;


  public acumuladorImpuestos: {
    [string: string]: { operado: number; total: number };
  } = {};

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['detalles']) {
      this._limpiarImpuestos();
      this._acumularImpuestos(this.detalles);
    }
  }

  private _acumularImpuestos(documentos: any[]) {
    documentos.forEach((documento) => {
      documento.impuestos.forEach((impuesto: any) => {
        const nombreImpuesto = impuesto.impuesto_nombre_extendido;

        if (!this.acumuladorImpuestos[nombreImpuesto]) {
          this.acumuladorImpuestos[nombreImpuesto] = { total: 0, operado: 0 };
          this.acumuladorImpuestos[nombreImpuesto].operado =
            impuesto.impuesto_operacion;
        }

        if (impuesto.impuesto_operacion > 0) {
          this.acumuladorImpuestos[nombreImpuesto].total += impuesto.total;
        } else {
          this.acumuladorImpuestos[nombreImpuesto].total -= impuesto.total;
        }
      });
    });

    return this.acumuladorImpuestos;
  }

  private _limpiarImpuestos() {
    this.acumuladorImpuestos = {};
  }
}
