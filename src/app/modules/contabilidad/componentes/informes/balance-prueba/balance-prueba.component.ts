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
import { map, Observable, of, tap } from 'rxjs';
import { BaseFiltroComponent } from '../../../../../comun/componentes/base-filtro/base-filtro.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { FechasService } from '@comun/services/fechas.service';

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
    SoloNumerosDirective,
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
        propiedad: 'anio',
        operador: 'igual',
        valor1: '2024',
        valor2: '',
        tipo: 'IntegerField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        campo: 'anio',
      },
      {
        propiedad: 'fecha_desde__gte',
        operador: '__gte',
        valor1: '2024-12-01',
        valor2: '',
        tipo: 'DateField',
        busquedaAvanzada: 'false',
        modeloBusquedaAvanzada: '',
        campo: 'fecha_desde',
      },
      {
        propiedad: 'fecha_hasta__lte',
        operador: '__lte',
        valor1: '2024-12-31',
        valor2: '',
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
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = `${currentYear}-01-01`;
    const lastDayOfYear = `${currentYear}-12-31`;

    this.formularioFiltros = this._formBuilder.group({
      anio: [currentYear, Validators.required],
      fecha_desde: [firstDayOfYear, Validators.required],
      fecha_hasta: [lastDayOfYear, Validators.required],
    });
  }

  private _consultarInformes(parametros: any) {
    this.contabilidadInformesService.consultarBalances(parametros).subscribe({
      next: (respuesta) => {
        this.cuentasAgrupadas = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  // private _groupData(data: MovimientoBalancePrueba[]): DataAgrupada {
  //   return data.reduce((acumulador, registro) => {
  //     const { cuenta_clase_id, cuenta_grupo_id, cuenta_cuenta_id } = registro;

  //     if (!acumulador[cuenta_clase_id]) {
  //       acumulador[cuenta_clase_id] = {
  //         total: {
  //           vr_debito: 0,
  //           vr_credito: 0,
  //         },
  //       };
  //     }

  //     if (!acumulador[cuenta_clase_id][cuenta_grupo_id]) {
  //       acumulador[cuenta_clase_id][cuenta_grupo_id] = {
  //         total: {
  //           vr_debito: 0,
  //           vr_credito: 0,
  //         },
  //       };
  //     }

  //     if (!acumulador[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id]) {
  //       acumulador[cuenta_clase_id][cuenta_grupo_id][cuenta_cuenta_id] = {
  //         vr_debito: 0,
  //         vr_credito: 0,
  //       };
  //     }

  //     // Actualizar valores a nivel de subcuenta
  //     acumulador[cuenta_clase_id][cuenta_grupo_id][
  //       cuenta_cuenta_id
  //     ].vr_debito += registro.vr_debito ?? 0;
  //     acumulador[cuenta_clase_id][cuenta_grupo_id][
  //       cuenta_cuenta_id
  //     ].vr_credito += registro.vr_credito ?? 0;

  //     // Actualizar valores a nivel de grupo
  //     acumulador[cuenta_clase_id][cuenta_grupo_id]['total'].vr_debito +=
  //       registro.vr_debito ?? 0;
  //     acumulador[cuenta_clase_id][cuenta_grupo_id]['total'].vr_credito +=
  //       registro.vr_credito ?? 0;

  //     // Actualizar valores a nivel de clase
  //     acumulador[cuenta_clase_id].total.vr_debito += registro.vr_debito ?? 0;
  //     acumulador[cuenta_clase_id].total.vr_credito += registro.vr_credito ?? 0;

  //     return acumulador;
  //   }, {} as DataAgrupada);
  // }

  private _construirFiltros() {
    this._limpiarFiltros();

    const anio = this.formularioFiltros.get('anio')?.value;
    const fechaDesde = this.formularioFiltros.get('fecha_desde')?.value;
    const fechaHasta = this.formularioFiltros.get('fecha_hasta')?.value;

    this._parametrosConsulta.filtros.push({
      propiedad: 'anio',
      operador: 'igual',
      valor1: anio,
      valor2: '',
      tipo: 'IntegerField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'anio',
    });

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_desde__gte',
      operador: '__gte',
      valor1: fechaDesde,
      valor2: '',
      tipo: 'DateField',
      busquedaAvanzada: 'false',
      modeloBusquedaAvanzada: '',
      campo: 'fecha_desde',
    });

    this._parametrosConsulta.filtros.push({
      propiedad: 'fecha_hasta__lte',
      operador: '__lte',
      valor1: fechaHasta,
      valor2: '',
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
}
