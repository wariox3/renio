import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnExportarComponent } from '@comun/componentes/btn-exportar/btn-exportar.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { MovimientoBalancePruebaTercero } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFiltroComponent } from '../../../../../comun/componentes/base-filtro/base-filtro.component';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnExportarComponent,
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);
  private _httpService = inject(HttpService);
  private _descargarArchivosService = inject(DescargarArchivosService);

  public cuentasAgrupadas: MovimientoBalancePruebaTercero[] = [];
  public formularioFiltros: FormGroup;
  public totalDebito: number = 0;
  public totalCredito: number = 0;
  public cargandoCuentas = signal<boolean>(false);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._initFormularioFiltros();
    this.changeDetectorRef.detectChanges();
  }

  private _initFormularioFiltros() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Primer día del mes actual
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
      .toISOString()
      .split('T')[0];

    // Último día del mes actual
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
      .toISOString()
      .split('T')[0];

    this.formularioFiltros = this._formBuilder.group(
      {
        fecha_desde: [firstDayOfMonth, Validators.required],
        fecha_hasta: [lastDayOfMonth, Validators.required],
        incluir_cierre: [false],
        cuenta_con_movimiento: [false],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  private _consultarInformes(parametros: GenerarBalancePrueba) {
    this.contabilidadInformesService.consultarBase(parametros).subscribe({
      next: (respuesta) => {
        this.cuentasAgrupadas = respuesta.registros;
        this.reiniciarTotales();
        this.cuentasAgrupadas.forEach((cuenta) => {
          this.totalCredito += cuenta.credito || 0;
          this.totalDebito += cuenta.debito || 0;
        });

        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private reiniciarTotales() {
    this.totalCredito = 0;
    this.totalDebito = 0;
  }

  generar() {
    this._consultarInformes(this.formularioFiltros.value);
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcel(
      {
        parametros: this.formularioFiltros.value,
        excel: true,
      },
      'contabilidad/movimiento/informe-base/',
    );
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;

      // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
      if (desde && hasta && new Date(desde) > new Date(hasta)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }
}

interface GenerarBalancePrueba {
  fecha_desde: string;
  fecha_hasta: string;
  incluir_cierre: boolean;
  cuenta_movimiento: boolean;
}
