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
import { MovimientoAuxiliarGeneral } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BaseFiltroComponent } from '../../../../../comun/componentes/base-filtro/base-filtro.component';

@Component({
  selector: 'app-auxiliar-general',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnExportarComponent,
    BaseFiltroComponent,
  ],
  templateUrl: './auxiliar-general.component.html',
  styleUrl: './auxiliar-general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxiliarGeneralComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);
  private _parametrosConsulta: any = {
    modelo: 'ConMovimiento',
    serializador: 'Informe',
    filtros: [
      {
        propiedad: 'fecha_desde',
        operador: 'gte',
        valor1: '2024-12-01',
        tipo: 'DateField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        campo: 'fecha_desde',
      },
      {
        propiedad: 'fecha_hasta',
        operador: 'lte',
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

  public cuentasAgrupadas: MovimientoAuxiliarGeneral[] = [];
  public formularioFiltros: FormGroup;
  public totalDebito: number = 0;
  public totalCredito: number = 0;

  private _descargarArchivosService = inject(DescargarArchivosService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._cargarFiltrosPredeterminados();
    this._initFormularioFiltros();
    this._construirFiltros();
    this.activatedRoute.queryParams.subscribe(() => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['auxiliar_general'] }),
      );
      this._consultarInformes(this._parametrosConsulta);
    });
    this.changeDetectorRef.detectChanges();
  }

  private _cargarFiltrosPredeterminados() {
    const filtroKey = 'contabilidad_auxiliargeneral';
    const filtroValue = [
      {
        propiedad: 'fecha',
        operadorFiltro: 'range',
        valor1: '2025-03-21',
        valor2: '2025-03-21',
        tipo: 'DateField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        operador: 'range',
        campo: 'fecha',
      },
      {
        propiedad: 'cierre',
        operadorFiltro: 'false',
        valor1: false,
        tipo: 'Booleano',
        operador: 'exact',
        campo: 'cierre',
      },
    ];

    localStorage.setItem(filtroKey, JSON.stringify(filtroValue));
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
        cierre: [],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  private _consultarInformes(parametros: any) {
    this.contabilidadInformesService
      .consultarAuxiliarGeneral(parametros)
      .subscribe({
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

  private _construirFiltros() {
    this._limpiarFiltros();

    // const anio = this.formularioFiltros.get('anio')?.value;
    const fechaDesde = this.formularioFiltros.get('fecha_desde')?.value;
    const fechaHasta = this.formularioFiltros.get('fecha_hasta')?.value;
    const cierre = this.formularioFiltros.get('cierre')?.value;

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_desde',
      operador: 'gte',
      valor1: fechaDesde,
      tipo: 'DateField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'fecha_desde',
    });

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_hasta',
      operador: 'lte',
      valor1: fechaHasta,
      tipo: 'DateField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'fecha_hasta',
    });

    this._parametrosConsulta.filtros.push({
      propiedad: 'cierre',
      operador: 'exact',
      valor1: cierre,
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

  descargarExcel() {
    this._descargarArchivosService.descargarExcel(
      {
        ...this._parametrosConsulta,
        limite: 5000,
        excel: true,
      },
      'contabilidad/movimiento/informe-auxiliar-general/',
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
