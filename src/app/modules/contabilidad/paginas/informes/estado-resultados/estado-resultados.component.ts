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
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { MovimientoBalancePruebaTercero, MovimientoEstadoResultados } from '@modulos/contabilidad/interfaces/contabilidad-balance.interface';
import { ContabilidadInformesService } from '@modulos/contabilidad/servicios/contabilidad-informes.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContactosComponent } from '../../../../../comun/componentes/contactos/contactos.component';

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
    CuentasComponent,
    ContactosComponent,
  ],
  templateUrl: './estado-resultados.component.html',
  styleUrl: './estado-resultados.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadoResultadosComponent extends General implements OnInit {
  private contabilidadInformesService = inject(ContabilidadInformesService);
  private _formBuilder = inject(FormBuilder);
  private _descargarArchivosService = inject(DescargarArchivosService);
  public estadoResultados: MovimientoEstadoResultados[] = [];
  public formularioFiltros: FormGroup;
  public cargandoCuentas = signal<boolean>(false);
  public cuentaDesdeCodigo = signal<string>('');
  public cuentaHastaNombre = signal<string>('');
  public cuentaHastaCodigo = signal<string>('');
  public cuentaDesdeNombre = signal<string>('');
  public contactoNombreCorto = signal<string>('');

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
        cuenta_desde: [''],
        cuenta_hasta: [''],
        cuenta_codigo_desde: [''],
        cuenta_codigo_hasta: [''],
        contacto_id: [''],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  private _consultarInformes(parametros: MovimientoEstadoResultados) {
    this.contabilidadInformesService.consultarEstadoResultados(parametros).subscribe({
      next: (respuesta) => {
        this.estadoResultados =  respuesta.registros
        this.changeDetectorRef.detectChanges();
      },
    });
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
      'contabilidad/movimiento/informe-estado-resultados/',
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

  limpiarCuentaDesde() {
    this.formularioFiltros.get('cuenta_desde')?.setValue('');
    this.formularioFiltros.get('cuenta_codigo_desde')?.setValue('');
    this.cuentaDesdeNombre.set('');
    this.cuentaDesdeCodigo.set('');
  }

  limpiarCuentaHasta() {
    this.formularioFiltros.get('cuenta_hasta')?.setValue('');
    this.formularioFiltros.get('cuenta_codigo_hasta')?.setValue('');
    this.cuentaHastaNombre.set('');
    this.cuentaHastaCodigo.set('');
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
    this.formularioFiltros.get('contacto_id')?.setValue(contacto.id);
    this.contactoNombreCorto.set(contacto.nombre_corto);
  }

  limpiarContacto() {
    this.formularioFiltros.get('contacto')?.setValue(null);
    this.formularioFiltros.get('nombre_corto')?.setValue('');
    this.contactoNombreCorto.set('');
  }
}
