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
import { MovimientoAuxiliarTercero } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { CuentasComponent } from '../../../../../comun/componentes/cuentas/cuentas.component';
import { ContactosComponent } from '../../../../../comun/componentes/contactos/contactos.component';

@Component({
  selector: 'app-auxiliar-tercero',
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
  templateUrl: './auxiliar-tercero.component.html',
  styleUrl: './auxiliar-tercero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuxiliarTerceroComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);

  public cuentasAgrupadas: MovimientoAuxiliarTercero[] = [];
  public formularioFiltros: FormGroup;
  public totalDebito: number = 0;
  public totalCredito: number = 0;
  public filtroKey = 'contabilidad_auxiliartercero';
  public cargandoCuentas = signal<boolean>(false);
  public cuentaDesdeNombre = signal<string>('');
  public cuentaDesdeCodigo = signal<string>('');
  public cuentaHastaNombre = signal<string>('');
  public cuentaHastaCodigo = signal<string>('');
  public contactoNombreCorto = signal<string>('');
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
        numero_identificacion: [''],
        nombre_corto: [''],
        cuenta_desde: [''],
        cuenta_codigo_desde: [''],
        cuenta_hasta: [''],
        cuenta_codigo_hasta: [''],
        contacto: [''],
        numero: [''],
        comprobante: [''],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  private _consultarInformes(parametros: GenerarAuxiliarTercero) {
    this.cargandoCuentas.set(true);
    this.contabilidadInformesService
      .consultarAuxiliarTercero(parametros)
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
    // this._httpService.descargarArchivo(
    //   'contabilidad/movimiento/informe-balance-prueba/',
    //   {
    //     parametros: this.formularioFiltros.value,
    //     pdf: true,
    //   },
    // );
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcel(
      {
        parametros: this.formularioFiltros.value,
        excel: true,
      },
      'contabilidad/movimiento/informe-auxiliar-tercero/',
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

  agregarContactoSeleccionado(contacto: {
    id: number;
    nombre_corto: string;
    numero_identificacion: string;
    plazo_pago__dias: number;
    plazo_pago_id: number;
    plazo_pago_proveedor__dias: number;
    plazo_pago_proveedor_id: number;
  }) {
    this.formularioFiltros.get('contacto')?.setValue(contacto.id);
    this.contactoNombreCorto.set(contacto.nombre_corto);
  }
}

interface GenerarAuxiliarTercero {
  fecha_desde: string;
  fecha_hasta: string;
  incluir_cierre: boolean;
  cuenta_movimiento: boolean;
  numero_identificacion: string;
  nombre_corto: string;
}
