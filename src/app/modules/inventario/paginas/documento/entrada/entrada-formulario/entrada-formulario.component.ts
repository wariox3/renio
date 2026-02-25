import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { AlmacenesComponent } from '@comun/componentes/almacenes/almacenes.component';
import { SpinnerLoaderComponent } from '@comun/componentes/ui/spinner-loader/spinner-loader.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ContactosComponent } from '@comun/componentes/contactos/contactos.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { SeleccionarProductoComponent } from '@comun/componentes/factura/components/seleccionar-producto/seleccionar-producto.component';
import { OperacionesService } from '@comun/componentes/factura/services/operaciones.service';
import { ImportarDetallesComponent } from '@comun/componentes/importar-detalles/importar-detalles.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';
import {
  DocumentoDetalleFactura,
  DocumentoInventarioRespuesta,
} from '@interfaces/comunes/factura/factura.interface';
import { EntradaService } from '@modulos/inventario/service/entrada.service';
import { FormularioEntradaService } from '@modulos/inventario/service/formulario-entrada.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  debounceTime,
  finalize,
  of,
  Subject,
  takeUntil,
  tap,
  zip,
} from 'rxjs';

@Component({
  selector: 'app-entrada-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EncabezadoFormularioNuevoComponent,
    CardComponent,
    TituloAccionComponent,
    TranslateModule,
    ContactosComponent,
    AlmacenesComponent,
    NgbNavModule,
    SoloNumerosDirective,
    SeleccionarProductoComponent,
    ImportarDetallesComponent,
    SpinnerLoaderComponent,
  ],
  templateUrl: './entrada-formulario.component.html',
  styleUrl: './entrada-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EntradaFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private _formBuilder = inject(FormBuilder);
  private _entradaService = inject(EntradaService);
  private _formularioEntradaService = inject(FormularioEntradaService);
  private _generalService = inject(GeneralService);
  private _operaciones = inject(OperacionesService);
  private _unsubscribe$ = new Subject<void>();
  private _modoEdicion: boolean = false;

  public formularioEntrada: FormGroup;
  public active: Number;
  public estado_aprobado = false;
  public theme_value = localStorage.getItem('kt_theme_mode_value');
  public guardando = signal(false);
  public cargando = signal(false);
  public total = signal(0);
  public totalCantidad = signal(0);
  public totalPrecio = signal(0);

  constructor() {
    super();
    this.formularioEntrada = this._formularioEntradaService.createForm();
  }

  ngOnInit() {
    this.active = 1;
    this._cargarVista();
    this._consultarInformacion();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  get detalles(): FormArray {
    return this.formularioEntrada.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.formularioEntrada.get('detalles_eliminados') as FormArray;
  }

  trackByDetalleIndex(index: number): number {
    return index;
  }

  consultardetalle() {
    this._cargarFormulario(this.detalle);
  }

  enviarFormulario() {
    if (this.formularioEntrada.valid) {
      this.guardando.set(true);
      if (this.detalle) {
        this._actualizarEntrada();
      } else {
        this._guardarEntrada();
      }
    } else {
      this.formularioEntrada.markAllAsTouched();
    }
  }

  contactoSeleccionado(contacto: any) {
    this.formularioEntrada.patchValue({
      contacto: contacto.id,
      contactoNombre: contacto.nombre_corto,
    });
  }

  almacenSeleccionado(almacen: any) {
    this.formularioEntrada.patchValue({
      almacen: almacen.id,
      almacenNombre: almacen.nombre,
    });
  }

  almacenSeleccionadoDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: item.id,
      almacenNombre: item.nombre,
    });
  }

  agregarDetalle() {
    const detalle = this.formularioEntrada.get('detalles') as FormArray;

    const almacen =
      this.formularioEntrada.get('almacen')?.value !== ''
        ? this.formularioEntrada.get('almacen')?.value
        : null;

    const almacenNombre =
      this.formularioEntrada.get('almacenNombre')?.value !== ''
        ? this.formularioEntrada.get('almacenNombre')?.value
        : null;

    const pagoFormGroup = this._formBuilder.group({
      item: [null, Validators.compose([Validators.required])],
      item_nombre: [null],
      cantidad: [
        0,
        [
          validarPrecio(),
          Validators.min(0.1),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
        ],
      ],
      precio: [
        0,
        [
          Validators.min(0),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
        ],
      ],
      almacen: [almacen, Validators.compose([Validators.required])],
      almacenNombre: [almacenNombre],
      id: [null],
      tipo_registro: ['I'],
      subtotal: [0],
      total_bruto: [0],
      total: [0],
    });

    this.formularioEntrada?.markAsDirty();
    this.formularioEntrada?.markAsTouched();

    detalle.push(pagoFormGroup);
    this._subscribeToControlChanges(pagoFormGroup);
    detalle?.markAllAsTouched();
  }

  eliminarItem(indexFormulario: number) {
    const detalle = this.detalles.at(indexFormulario);
    this._registrarItemDetalleEliminado(detalle.value.id);
    this.detalles.removeAt(indexFormulario);
    this._actualizarTotalesFormulario();
  }

  recibirItemSeleccionado(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue({
      precio: item.costo,
      item: item.id,
      cantidad: 1,
      item_nombre: item.nombre,
    });
    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
  }

  limpiarCampoItemDetalle(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue({
      item: null,
      item_nombre: null,
    });
    this.formularioEntrada?.markAsDirty();
    this.formularioEntrada?.markAsTouched();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'comentario') {
      if (this.formularioEntrada.get(campo)?.value === '') {
        this.formularioEntrada.get(campo)?.setValue(null);
      }
    }
  }

  limpiarCampoAlmacen(item: any) {
    this.formularioEntrada.patchValue({
      almacen: null,
      almacenNombre: null,
    });
  }

  limpiarCampoAlmacenDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: null,
      almacenNombre: null,
    });
  }

  validarCamposDetalles() {
    let errores = false;
    Object.values(this.detalles.controls).find((control: any) => {
      if (control.get('item').value === null) {
        control.markAsTouched();
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.alertaService.mensajeError(
          'Error en formulario',
          'El campo item no puede estar vacío',
        );
      }
      if (control.get('almacen').value === null) {
        control.markAsTouched();
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.alertaService.mensajeError(
          'Error en formulario',
          'El campo alamcen en los detalles no puede estar vacío',
        );
      }
    });
    this.changeDetectorRef.markForCheck();
    return errores;
  }

  private _subscribeToControlChanges(controlGroup: AbstractControl) {
    controlGroup.get('cantidad')?.valueChanges
      .pipe(debounceTime(150), takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          const idx = this.detalles.controls.indexOf(controlGroup);
          if (idx >= 0) this._actualizarCantidadItem(idx, Number(valor));
        }
      });

    controlGroup.get('precio')?.valueChanges
      .pipe(debounceTime(150), takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (Number(valor) >= 0) {
          const idx = this.detalles.controls.indexOf(controlGroup);
          if (idx >= 0) this._actualizarPrecioItem(idx, Number(valor));
        }
      });
  }

  private _actualizarEntrada() {
    if (this.validarCamposDetalles() === false) {
      this._calcularTotales();
      this._entradaService
        .actualizarDatos({
          ...this.formularioEntrada.value,
          id: this.detalle,
        })
        .pipe(
          finalize(() => this.guardando.set(false)),
          tap((respuesta) => {
            this.router.navigate(
              [`inventario/documento/detalle/${respuesta.documento.id}`],
              {
                queryParams: {
                  ...this.parametrosUrl,
                },
              },
            );
          }),
          catchError(() => {
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.guardando.set(false);
    }
  }

  private _actualizarCantidadItem(
    indexFormulario: number,
    nuevaCantidad: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue(
      { cantidad: nuevaCantidad },
      { emitEvent: false },
    );

    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.markForCheck();
  }

  private _actualizarPrecioItem(indexFormulario: number, nuevoPrecio: number) {
    this.detalles.controls[indexFormulario].patchValue(
      { precio: nuevoPrecio },
      { emitEvent: false },
    );
    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.markForCheck();
  }

  private _guardarEntrada() {
    if (this.validarCamposDetalles() === false) {
      this._calcularTotales();
      this._entradaService
        .guardarFactura({
          ...this.formularioEntrada.value,
          ...{
            numero: null,
            documento_tipo: 9,
          },
        })
        .pipe(
          finalize(() => this.guardando.set(false)),
          tap((respuesta) => {
            this.router.navigate(
              [`inventario/documento/detalle/${respuesta.documento.id}`],
              {
                queryParams: {
                  ...this.parametrosUrl,
                },
              },
            );
          }),
          catchError(() => {
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.guardando.set(false);
    }
  }

  private _calcularTotales() {
    let subtotal = 0;
    let total = 0;
    let total_bruto = 0;

    this.detalles.controls.forEach((control: any) => {
      subtotal += control.get('subtotal').value;
      total += control.get('total').value;
      total_bruto += control.get('total_bruto').value;
    });

    this.formularioEntrada.patchValue({
      subtotal: subtotal,
      total: total,
      total_bruto: total_bruto,
    });
  }

  private _consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarInvAlmacen>(
        'inventario/almacen/seleccionar/'
      ),
    ).subscribe((respuesta: any) => {
      let arrAlmacenes = respuesta[0];
      this.formularioEntrada.patchValue({
        almacen: arrAlmacenes[0].id,
        almacenNombre: arrAlmacenes[0].nombre,
      });
      this.changeDetectorRef.markForCheck();
    });
  }

  private _registrarItemDetalleEliminado(id: string | null) {
    if (!this._modoEdicion || !id) {
      return null;
    }

    this.detallesEliminados.value.push(id);
  }

  private _cargarVista() {
    if (this.detalle) {
      this._modoEdicion = true;
      this._cargarFormulario(this.detalle);
    } else {
      this._modoEdicion = false;
    }
  }

  private _cargarFormulario(id: number) {
    this.cargando.set(true);
    this._entradaService
      .consultarDetalle(id)
      .pipe(
        finalize(() => {
          this.cargando.set(false);
          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this._unsubscribe$),
      )
      .subscribe((respuesta) => {
        this._poblarFormulario(respuesta.documento);
      });
  }

  private _poblarFormulario(documentoFactura: DocumentoInventarioRespuesta) {
    this.estado_aprobado = documentoFactura.estado_aprobado;
    this._poblarDocumento(documentoFactura);
    this._poblarDocumentoDetalle(documentoFactura.detalles);
    this.changeDetectorRef.markForCheck();
  }

  private _poblarDocumento(documentoFactura: DocumentoInventarioRespuesta) {
    this.formularioEntrada.patchValue({
      contacto: documentoFactura.contacto_id,
      contactoNombre: documentoFactura.contacto_nombre_corto,
      almacen: documentoFactura.almacen_id,
      almacenNombre: documentoFactura.almacen_nombre,
      fecha: documentoFactura.fecha,
      comentario: documentoFactura.comentario,
      detalles: [],
    });
  }

  private _poblarDocumentoDetalle(documentoDetalle: any[]) {
    this.detalles.clear();
    documentoDetalle.forEach((detalle) => {
      const total = this._operaciones.redondear(detalle.cantidad * detalle.precio, 2);
      const grupo = this._formBuilder.group({
        id: [detalle.id],
        precio: [
          detalle.precio,
          [Validators.min(0), Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$')],
        ],
        item: [detalle.item],
        item_nombre: [detalle.item_nombre],
        almacen: [detalle.almacen_id],
        almacenNombre: [detalle.almacen_nombre],
        cantidad: [
          detalle.cantidad,
          [
            validarPrecio(),
            Validators.min(1),
            Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
          ],
        ],
        tipo_registro: [detalle.tipo_registro],
        subtotal: [total],
        total_bruto: [total],
        total: [total],
      });
      this.detalles.push(grupo);
      this._subscribeToControlChanges(grupo);
    });
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.markForCheck();
  }

  private _calcularTotalesDetalle(indexDetalle: number) {
    const detalle = this.detalles.value[indexDetalle];
    const total = this._operaciones.redondear(detalle.cantidad * detalle.precio, 2)

    this.detalles.controls[indexDetalle].patchValue({
      total: total,
      subtotal: total,
      total_bruto: total,
    }, { emitEvent: false });
  }

  private _actualizarTotalesFormulario() {
    const values = this.detalles.value;
    let totalCantidad = 0;
    let totalGeneral = 0;

    for (const detalle of values) {
      totalCantidad += detalle.cantidad || 0;
      totalGeneral += detalle.subtotal || 0;
    }

    this.totalCantidad.set(totalCantidad);
    this.totalPrecio.set(totalGeneral);
    this.total.set(totalGeneral);
  }
}
