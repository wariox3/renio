import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import {
  DocumentoDetalleFactura,
  DocumentoFacturaRespuesta,
  ImpuestoRespuestaConsulta,
} from '@interfaces/comunes/factura/factura.interface';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FacturaService } from '../../services/factura.service';
import { SeleccionarAlmacenComponent } from '../seleccionar-almacen/seleccionar-almacen.component';
import { SeleccionarGrupoComponent } from '../seleccionar-grupo/seleccionar-grupo.component';
import { SeleccionarImpuestosComponent } from '../seleccionar-impuestos/seleccionar-impuestos.component';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';

@Component({
  selector: 'app-formulario-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SeleccionarImpuestosComponent,
    SeleccionarProductoComponent,
    NgbTooltipModule,
    SeleccionarAlmacenComponent,
    SeleccionarGrupoComponent,
  ],
  templateUrl: './formulario-productos.component.html',
  styleUrl: './formulario-productos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioProductosComponent
  extends General
  implements OnDestroy, OnInit
{
  private _formularioFacturaService = inject(FormularioFacturaService);
  private _facturaService = inject(FacturaService);
  private _unsubscribe$ = new Subject<void>();

  public formularioFactura = this._formularioFacturaService.form;
  public themeValue = localStorage.getItem('kt_theme_mode_value');
  public modoEdicion = this._formularioFacturaService.modoEdicion;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;

  @Input() mostrarDocumentoReferencia: boolean = false;
  @Input() cuentasConImpuestos: boolean = false;
  @Input() permiteCantidadCero = false;
  @Input({ required: true }) formularioTipo: 'venta' | 'compra' = 'venta';
  @Output() emitirEnviarFormulario: EventEmitter<void>;
  @Output() emitirDocumentoDetalle: EventEmitter<DocumentoFacturaRespuesta>;

  constructor() {
    super();
    this.emitirEnviarFormulario = new EventEmitter<void>();
    this.emitirDocumentoDetalle = new EventEmitter();
  }

  ngOnInit(): void {
    this._cargarVista();
  }

  // listeners
  onCantidadChange(i: number) {
    this._formularioFacturaService
      .onCantidadChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarCantidadItem(i);
        }
      });
  }

  onPrecioChange(i: number) {
    this._formularioFacturaService
      .onPrecioChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarPrecioItem(i);
        }
      });
  }

  onDescuentoChange(i: number) {
    this._formularioFacturaService
      .onDescuentoChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: number | null) => {
        const nuevoValor = valor || 0;
        if (nuevoValor >= 0) {
          this._formularioFacturaService.actualizarDescuentoItem(i);
        }
      });
  }

  onSeleccionarGrupoChange(id: number, indexFormulario: number) {
    this._formularioFacturaService.onSeleccionarGrupoChange(
      id,
      indexFormulario,
    );
  }

  eliminarItem(indexFormulario: number) {
    this._formularioFacturaService.eliminarItem(indexFormulario);
  }

  /**
   * Se ejecuta cuando el usuario da clic en agregar nuevo item
   */
  agregarNuevoItem(tipo_registro: string) {
    this._formularioFacturaService.agregarNuevoItem(tipo_registro);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Se ejecuta cuando el usuario selecciona un producto del selector
   *
   * @param item
   * @param indexFormulario
   */
  recibirItemSeleccionado(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this._formularioFacturaService.recibirItemSeleccionado(
      item,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  recibirAlmacenSeleccionado(
    almacen: RegistroAutocompletarInvAlmacen,
    index: number,
  ) {
    if (!almacen) {
      this._formularioFacturaService.onSeleccionarAlmacenChange(null, index);
    } else {
      this._formularioFacturaService.onSeleccionarAlmacenChange(almacen, index);
    }
  }

  /**
   * Se ejecuta cuando el usuario realiza cambios en el componente de impuestos del item
   *
   * @param impuestos
   * @param indexFormulario
   */
  recibirImpuestosModificados(
    impuestos: ImpuestoRespuestaConsulta[],
    indexFormulario: number,
  ) {
    this._formularioFacturaService.recibirImpuestosModificados(
      impuestos,
      indexFormulario,
    );
    this.changeDetectorRef.detectChanges();
  }

  // acumulador impuestos

  // funciones documento formulario

  // funciones formulario detalle

  // funciones formulario impuestos

  // cargar vista
  private _cargarFormulario(id: number) {
    this._facturaService
      .consultarDetalleFactura(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this.emitirDocumentoDetalle.emit(respuesta.documento);
        this._poblarFormulario(respuesta.documento);
      });
  }

  private _poblarFormulario(documentoFactura: DocumentoFacturaRespuesta) {
    this.estadoAprobado.set(documentoFactura.estado_aprobado);
    this._formularioFacturaService.poblarDocumento(documentoFactura);
    this._formularioFacturaService.poblarDocumentoDetalle(
      documentoFactura.detalles,
    );
    this._formularioFacturaService.cargarDocumentoReferencia(documentoFactura);
    this._formularioFacturaService.cargarPagos(documentoFactura);
    this.changeDetectorRef.detectChanges();
  }

  private _cargarVista() {
    const detalleId = this.activatedRoute.snapshot.paramMap.get('id');
    if (detalleId) {
      this.modoEdicion.set(true);
      this.detalle = Number(detalleId);
      this._cargarFormulario(this.detalle);
    } else {
      this.modoEdicion.set(false);
    }
  }

  // funciones impuestos de formulario detalle

  // metodos formulario
  get detalles(): FormArray {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.formularioFactura.get('detalles_eliminados') as FormArray;
  }

  get pagos() {
    return this.formularioFactura.get('pagos') as FormArray;
  }

  get totalAfectado() {
    return this.formularioFactura.get('afectado') as FormControl;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
