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
import { HttpService } from '@comun/services/http.service';
import { MovimientoAuxiliarCuenta } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { CuentasComponent } from '../../../../../comun/componentes/cuentas/cuentas.component';
import { ContactosComponent } from '../../../../../comun/componentes/contactos/contactos.component';

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
  selector: 'app-auxiliar-cuenta',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnExportarComponent,
    CuentasComponent,
    ContactosComponent,
  ],
  templateUrl: './auxiliar-cuenta.component.html',
  styleUrl: './auxiliar-cuenta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuxiliarCuentaComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);
  private _parametrosConsulta: any = {
    modelo: 'ConMovimiento',
    serializador: 'Informe',
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };

  public cuentasAgrupadas: MovimientoAuxiliarCuenta[] = [];
  public formularioFiltros: FormGroup;
  public totalDebito: number = 0;
  public totalCredito: number = 0;
  public cargandoCuentas = signal<boolean>(false);
  public cuentaDesdeNombre = signal<string>('');
  public cuentaDesdeCodigo = signal<string>('');
  public cuentaHastaNombre = signal<string>('');
  public cuentaHastaCodigo = signal<string>('');
  public filtroKey = 'contabilidad_auxiliarcuenta';

  private _httpService = inject(HttpService);
  private _descargarArchivosService = inject(DescargarArchivosService);

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
        // anio: [currentYear, Validators.required],
        fecha_desde: [firstDayOfMonth, Validators.required],
        fecha_hasta: [lastDayOfMonth, Validators.required],
        incluir_cierre: [false],
        cuenta_con_movimiento: [false],
        comprobante: [''],
        cuenta: [''],
        cuenta_desde: [''],
        cuenta_hasta: [''],
        cuenta_codigo_desde: [''],
        cuenta_codigo_hasta: [''],
        contacto: [''],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  private _consultarInformes(parametros: GenerarAuxiliarCuenta) {
    this.cargandoCuentas.set(true);
    this.contabilidadInformesService
      .consultarAuxiliarCuenta(parametros)
      .pipe(finalize(() => this.cargandoCuentas.set(false)))
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

  imprimir() {
    this._httpService.descargarArchivo(
      'contabilidad/movimiento/informe-auxiliar-cuenta/',
      {
        ...this._parametrosConsulta,
        pdf: true,
      },
    );
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcel(
      {
        parametros: this.formularioFiltros.value,
        excel: true,
      },
      'contabilidad/movimiento/informe-auxiliar-cuenta/',
    );
  }

  // descargarExcel() {
  //   this._descargarArchivosService.descargarExcel(
  //     {
  //       ...this._parametrosConsulta,
  //       limite: 5000,
  //       excel: true,
  //     },
  //     'contabilidad/movimiento/informe-auxiliar-cuenta/',
  //   );
  // }

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

  generar() {
    this._consultarInformes(this.formularioFiltros.value);
  }

  agregarCuentaDesdeSeleccionado(cuenta: {
    id: number;
    nombre: string;
    codigo: string;
  }) {
    this.formularioFiltros.get('cuenta_desde')?.setValue(cuenta.id);
    this.formularioFiltros.get('cuenta_codigo_desde')?.setValue(cuenta.codigo);
    this.cuentaDesdeNombre.set(cuenta.nombre);
    this.cuentaDesdeCodigo.set(cuenta.codigo);
  }

  agregarCuentaHastaSeleccionado(cuenta: {
    id: number;
    nombre: string;
    codigo: string;
  }) {
    this.formularioFiltros.get('cuenta_hasta')?.setValue(cuenta.id);
    this.formularioFiltros.get('cuenta_codigo_hasta')?.setValue(cuenta.codigo);
    this.cuentaHastaNombre.set(cuenta.nombre);
    this.cuentaHastaCodigo.set(cuenta.codigo);
  }

}

interface GenerarAuxiliarCuenta {
  fecha_desde: string;
  fecha_hasta: string;
  incluir_cierre: boolean;
  cuenta_movimiento: boolean;
  comprobante: string;
  cuenta: string;
  cuenta_desde: string;
  cuenta_hasta: string;
}
