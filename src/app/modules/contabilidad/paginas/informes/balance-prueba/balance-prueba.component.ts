import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { HttpService } from '@comun/services/http.service';
import { MovimientoBalancePrueba } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

interface DataAgrupada {
  [cuentaClaseId: number | string]: {
    total: {
      vr_debito: number;
      vr_credito: number;
    };
    [cuentaGrupoId: number]: {
      [cuentaSubcuentaId: number | string]: {
        vr_debito: number;
        vr_credito: number;
      };
      total: {
        vr_debito: number;
        vr_credito: number;
      };
    };
  };
}

@Component({
  selector: 'app-balance-prueba',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnExportarComponent,
  ],
  templateUrl: './balance-prueba.component.html',
  styleUrl: './balance-prueba.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalancePruebaComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);
  private _parametrosConsulta: any = {
    modelo: 'ConMovimiento',
    serializador: 'Informe',
    filtros: [
      {
        propiedad: 'fecha_desde__gte',
        valor1: '2024-12-01',
        tipo: 'DateField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        campo: 'fecha_desde',
      },
      {
        propiedad: 'fecha_hasta__lte',
        valor1: '2024-12-31',
        tipo: 'DateField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        campo: 'fecha_hasta',
      },
    ],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };

  public cuentasAgrupadas: MovimientoBalancePrueba[] = [];
  public formularioFiltros: FormGroup;
  private _httpService = inject(HttpService);
  private _descargarArchivosService = inject(DescargarArchivosService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._initFormularioFiltros();
    this._construirFiltros();
    this.activatedRoute.queryParams.subscribe(() => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['balance_prueba'] })
      );
      this._consultarInformes(this._parametrosConsulta);
    });
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
        // anio: [currentYear, Validators.required],
        fecha_desde: [firstDayOfMonth, Validators.required],
        fecha_hasta: [lastDayOfMonth, Validators.required],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta'
        ),
      }
    );
  }

  private _consultarInformes(parametros: any) {
    this.contabilidadInformesService.consultarBalances(parametros).subscribe({
      next: (respuesta) => {
        this.cuentasAgrupadas = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private _construirFiltros() {
    this._limpiarFiltros();

    // const anio = this.formularioFiltros.get('anio')?.value;
    const fechaDesde = this.formularioFiltros.get('fecha_desde')?.value;
    const fechaHasta = this.formularioFiltros.get('fecha_hasta')?.value;

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_desde__gte',
      valor1: fechaDesde,
      tipo: 'DateField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'fecha_desde',
    });

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_hasta__lte',
      valor1: fechaHasta,
      tipo: 'DateField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'fecha_hasta',
    });
  }

  private _limpiarFiltros() {
    this._parametrosConsulta.filtros = [];
  }

  obtenerFiltros(arrfiltros: any[]) {
    if (arrfiltros.length >= 1) {
      this._parametrosConsulta.filtros = arrfiltros;
      this.changeDetectorRef.detectChanges();
    } else {
      this._parametrosConsulta.filtros = [];
    }

    this.changeDetectorRef.detectChanges();
    this._consultarInformes(this._parametrosConsulta);
  }

  aplicarFiltro() {
    this._construirFiltros();
    this._consultarInformes(this._parametrosConsulta);
  }

  imprimir() {
    this._httpService.descargarArchivo(
      'contabilidad/movimiento/imprimir/',
      this._parametrosConsulta
    );
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcelDocumentos({
      ...this._parametrosConsulta,
      excel: true,
      ...{
        limite: 5000,
      },
    });
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string
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
