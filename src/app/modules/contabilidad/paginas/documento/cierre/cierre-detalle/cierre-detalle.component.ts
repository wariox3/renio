import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { DocumentoOpcionesComponent } from '../../../../../../comun/componentes/documento-opciones/documento-opciones.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { GeneralService } from '@comun/services/general.service';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import {
  DetalleCierreEncabezado,
  DetalleCuenta,
} from '@modulos/contabilidad/interfaces/cierre.interface';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';

@Component({
  selector: 'app-cierre-detalle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BtnAtrasComponent,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    NgbDropdownModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    DocumentoOpcionesComponent,
    CuentasComponent,
    PaginadorComponent,
  ],
  templateUrl: './cierre-detalle.component.html',
})
export default class CierreDetalleComponent extends General {
  private _modalService = inject(NgbModal);
  private _formBuilder = inject(FormBuilder);
  private _generalService = inject(GeneralService);
  private _descargarService = inject(DescargarArchivosService);
  cargandoTabla = signal<boolean>(false);
  formularioResultado: FormGroup;
  cierre = signal<DetalleCierreEncabezado | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  cantidadRegistros = signal(0);
  cuentaDesdeCodigo = signal<string>('');
  cuentaDesdeNombre = signal<string>('');
  cuentaHastaCodigo = signal<string>('');
  cuentaHastaNombre = signal<string>('');
  cuentaUtilidadCodigo = signal<string>('');
  cuentaUtilidadNombre = signal<string>('');
  cargandoResultados = signal<boolean>(false);

  detalles = signal<DetalleCuenta[]>([]);
  tabActive = 1;
  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService,
  ) {
    super();
    this.initFormularioResultados();
    this.consultarEncabezdo().subscribe((respuesta) => {
      this.cierre.set(respuesta);
    });
    this.consultardetalle();
  }

  consultarEncabezdo() {
    return this._generalService
      .consultaApi<DetalleCierreEncabezado>(
        `general/documento/${this.detalle}/`,
        {
          serializador: 'detalle_cierre',
        },
      )
      .pipe(
        finalize(() => {
          this.cargandoTabla.set(false);
        }),
      );
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.consultardetalle({
      page,
    });
  }

  desaprobado() {
    this.consultarEncabezdo().subscribe((respuesta) => {
      this.cierre.set(respuesta);
    });
  }

  consultardetalle(params?: ParametrosApi) {
    this.cargandoTabla.set(true);
    this._generalService
      .consultaApi<RespuestaApi<DetalleCuenta>>('general/documento_detalle/', {
        ...params,
        documento_id: this.detalle,
        serializador: 'lista_detalle_cuenta',
        ordering: 'id',
      })
      .pipe(
        finalize(() => {
          this.cargandoTabla.set(false);
        }),
      )
      .subscribe((respuesta) => {
        // this.cierre = respuesta.documento;
        this.detalles.set(respuesta.results);
        this.cantidadRegistros.set(respuesta.count);
      });
  }

  initFormularioResultados() {
    this.formularioResultado = this._formBuilder.group({
      id: this.detalle,
      cuenta_desde_codigo: [null, Validators.required],
      cuenta_hasta_codigo: [null, Validators.required],
      cuenta_cierre_id: [null, Validators.required],
    });
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('general/documento/aprobar/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta ? this.consultarEncabezdo() : EMPTY,
        ),
        tap((respuestaConsultaDetalle) => {
          if (respuestaConsultaDetalle) {
            this.cierre.set(respuestaConsultaDetalle);
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO'),
            );
          }
        }),
      )
      .subscribe();
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }

  anular() {
    this.alertaService
      .anularSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('general/documento/anular/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        tap((respuesta: any) => {
          if (respuesta) {
            this.consultarEncabezdo().subscribe((respuesta) => {
              this.cierre.set(respuesta);
            });
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOANULADO'),
            );
          }
        }),
      )
      .subscribe();
  }

  navegarEditar(id: number | undefined) {
    this.router.navigate([`contabilidad/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`contabilidad/documento/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  // Obtener total de débitos
  getTotalDebito(): number {
    return this.detalles()
      .filter((detalle) => detalle.naturaleza === 'D') // Filtrar naturaleza 'D'
      .reduce((total, detalle) => total + detalle.precio, 0); // Acumular los valores de 'pago'
  }

  // Obtener total de créditos
  getTotalCredito(): number {
    return this.detalles()
      .filter((detalle) => detalle.naturaleza === 'C') // Filtrar naturaleza 'C'
      .reduce((total, detalle) => total + detalle.precio, 0); // Acumular los valores de 'pago'
  }

  eliminarItems() {
    this.httpService
      .post('general/documento_detalle/eliminar-todos/', {
        documento_id: this.detalle,
      })
      .subscribe((respuesta) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Detalles eliminados exitosamente');
      });
  }

  abrirModalResultados(modalResultadosContent: any) {
    this._abrirModal(modalResultadosContent);
  }

  private _abrirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  descargarExcelDetalle() {
    this._descargarService.exportarExcel(`general/documento_detalle`, {
      documento_id: this.detalle,
      serializador: 'lista_detalle_cuenta',
    });
  }

  agregarCuentaDesdeSeleccionado(cuenta: any) {
    this.formularioResultado
      .get('cuenta_desde_codigo')
      ?.setValue(cuenta.codigo);
    this.cuentaDesdeNombre.set(cuenta.nombre);
    this.cuentaDesdeCodigo.set(cuenta.codigo);
  }

  agregarCuentaHastaSeleccionado(cuenta: any) {
    this.formularioResultado
      .get('cuenta_hasta_codigo')
      ?.setValue(cuenta.codigo);
    this.cuentaHastaNombre.set(cuenta.nombre);
    this.cuentaHastaCodigo.set(cuenta.codigo);
  }

  agregarCuentaUtilidadSeleccionado(cuenta: any) {
    this.formularioResultado.get('cuenta_cierre_id')?.setValue(cuenta.id);
    this.cuentaUtilidadNombre.set(cuenta.nombre);
    this.cuentaUtilidadCodigo.set(cuenta.codigo);
  }

  limpiarCuentaDesdeSeleccionado() {
    this.formularioResultado.get('cuenta_desde_codigo')?.setValue(null);
    this.cuentaDesdeNombre.set('');
    this.cuentaDesdeCodigo.set('');
  }

  limpiarCuentaHastaSeleccionado() {
    this.formularioResultado.get('cuenta_hasta_codigo')?.setValue(null);
    this.cuentaHastaNombre.set('');
    this.cuentaHastaCodigo.set('');
  }

  limpiarCuentaUtilidadSeleccionado() {
    this.formularioResultado.get('cuenta_cierre_id')?.setValue(null);
    this.cuentaUtilidadNombre.set('');
    this.cuentaUtilidadCodigo.set('');
  }

  enviarFormularioResultados() {
    this.cargandoResultados.set(true);
    this.facturaService
      .cargarResultados(this.formularioResultado.value)
      .pipe(
        finalize(() => {
          this.cargandoResultados.set(false);
          this.limpiarCuentaDesdeSeleccionado();
          this.limpiarCuentaHastaSeleccionado();
          this.limpiarCuentaUtilidadSeleccionado();
          this._modalService.dismissAll();
        }),
      )
      .subscribe((response) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Resultados cargados con exito!');
      });
  }
}
