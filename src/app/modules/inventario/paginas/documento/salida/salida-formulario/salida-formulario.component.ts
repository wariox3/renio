import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { FormularioSalidaService } from '@modulos/inventario/service/formulario-salida.service';
import { SalidaService } from '@modulos/inventario/service/salida.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  catchError,
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
  ],
  templateUrl: './salida-formulario.component.html',
  styleUrl: './salida-formulario.component.scss',
})
export default class SalidaFormularioComponent
  extends General
  implements OnInit
{
  private _formBuilder = inject(FormBuilder);
  private _salidaService = inject(SalidaService);
  private _formularioSalidaService = inject(FormularioSalidaService);
  private _generalService = inject(GeneralService);
  private _operaciones = inject(OperacionesService);
  private _unsubscribe$ = new Subject<void>();
  private _modoEdicion: boolean = false;

  public formularioSalida: FormGroup;
  public active: Number;
  public estado_aprobado = false;
  public theme_value = localStorage.getItem('kt_theme_mode_value');
  public botonGuardarDeshabilitado$: BehaviorSubject<boolean>;
  public total = signal(0);
  public totalCantidad = signal(0);
  public totalPrecio = signal(0);

  constructor() {
    super();
    this.botonGuardarDeshabilitado$ = new BehaviorSubject<boolean>(false);
    this.formularioSalida = this._formularioSalidaService.createForm();
  }

  ngOnInit() {
    this.active = 1;
    this._cargarVista();
    this._consultarInformacion();
  }

  get detalles(): FormArray {
    return this.formularioSalida.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.formularioSalida.get('detalles_eliminados') as FormArray;
  }

  consultardetalle() {
    this._cargarFormulario(this.detalle);
  }

  enviarFormulario() {
    if (this.formularioSalida.valid) {
      if (this.detalle) {
        this._actualizarSalida();
      } else {
        this._guardarSalida();
      }
    } else {
      this.formularioSalida.markAllAsTouched();
    }
  }

  contactoSeleccionado(contacto: any) {
    this.formularioSalida.patchValue({
      contacto: contacto.id,
      contactoNombre: contacto.nombre_corto,
    });
  }

  almacenSeleccionado(almacen: any) {
    this.formularioSalida.patchValue({
      almacen: almacen.id,
      almacenNombre: almacen.nombre,
    });
  }

  almacenSeleccionadoDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: item.id,
      almacenNombre: item.nombre,
    });
    this.changeDetectorRef.detectChanges();
  }

  agregarDetalle() {
    const detalle = this.formularioSalida.get('detalles') as FormArray;

    const almacen =
      this.formularioSalida.get('almacen')?.value !== ''
        ? this.formularioSalida.get('almacen')?.value
        : null;

    const almacenNombre =
      this.formularioSalida.get('almacenNombre')?.value !== ''
        ? this.formularioSalida.get('almacenNombre')?.value
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
        [Validators.min(0), Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$')],
      ],
      almacen: [almacen, Validators.compose([Validators.required])],
      almacenNombre: [almacenNombre],
      id: [null],
      tipo_registro: ['I'],
      subtotal: [0],
      total_bruto: [0],
      total: [0],
    });

    this.formularioSalida?.markAsDirty();
    this.formularioSalida?.markAsTouched();

    detalle.push(pagoFormGroup);
    detalle?.markAllAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  eliminarItem(indexFormulario: number) {
    const itemsActualizados = this.detalles.value.filter(
      (detalleFormulario: any, index: number) => {
        if (indexFormulario === index) {
          this._registrarItemDetalleEliminado(detalleFormulario.id);
        }
        return index !== indexFormulario;
      },
    );

    this.detalles.clear();

    itemsActualizados.forEach((item: any, i: number) => {
      this.agregarDetalle();
      this.detalles.controls[i].patchValue({
        id: item.id || null,
        precio: item.precio,
        item: item.item,
        item_nombre: item.item_nombre,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
        total: item.total,
        total_bruto: item.total_bruto,
      });
    });

    this._limpiarFormularioTotales();
    this._actualizarTotalesFormulario();
  }

  onCantidadChange(i: number) {
    this.detalles.controls[i]
      .get('cantidad')
      ?.valueChanges.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._actualizarCantidadItem(i, Number(valor));
        }
      });
  }

  onPrecioChange(i: number) {
    this.detalles.controls[i]
      .get('precio')
      ?.valueChanges.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (Number(valor) >= 0) {
          this._actualizarPrecioItem(i, Number(valor));
        }
      });
  }

  recibirItemSeleccionado(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue({
      precio: item.precio,
      item: item.id,
      cantidad: 1,
      item_nombre: item.nombre,
    });
    this._limpiarFormularioTotales();
    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.detectChanges();
  }

  limpiarCampoItemDetalle(
    item: DocumentoDetalleFactura,
    indexFormulario: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue({
      item: null,
      item_nombre: null,
    });
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'comentario') {
      if (this.formularioSalida.get(campo)?.value === '') {
        this.formularioSalida.get(campo)?.setValue(null);
      }
    }
  }

  limpiarCampoAlmacen(item: any) {
    this.formularioSalida.patchValue({
      almacen: null,
      almacenNombre: null,
    });
    this.changeDetectorRef.detectChanges();
  }

  limpiarCampoAlmacenDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: null,
      almacenNombre: null,
    });
    this.changeDetectorRef.detectChanges();
  }

  private _actualizarSalida() {
    if (this.validarCamposDetalles() === false) {
      this._calcularTotales();
      this._salidaService
        .actualizarDatos({
          ...this.formularioSalida.value,
          id: this.detalle,
        })
        .pipe(
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
            this.botonGuardarDeshabilitado$.next(false);
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.botonGuardarDeshabilitado$.next(false);
    }
  }

  // funciones formulario detalle
  private _actualizarCantidadItem(
    indexFormulario: number,
    nuevaCantidad: number,
  ) {
    this.detalles.controls[indexFormulario].patchValue(
      { cantidad: nuevaCantidad },
      { emitEvent: false }, // ❗ Evita disparar valueChanges de nuevo
    );

    this._limpiarFormularioTotales();
    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _actualizarPrecioItem(indexFormulario: number, nuevoPrecio: number) {
    this.detalles.controls[indexFormulario].patchValue(
      { precio: nuevoPrecio },
      { emitEvent: false }, // ❗ Evita disparar valueChanges de nuevo
    );
    this._limpiarFormularioTotales();
    this._calcularTotalesDetalle(indexFormulario);
    this._actualizarTotalesFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _guardarSalida() {
    if (this.validarCamposDetalles() === false) {
      // realizar calculos de subtotal y total
      this._calcularTotales();
      this._salidaService
        .guardarFactura({
          ...this.formularioSalida.value,
          ...{
            numero: null,
            documento_tipo: 10,
          },
        })
        .pipe(
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
            this.botonGuardarDeshabilitado$.next(false);
            return of(null);
          }),
        )
        .subscribe();
    } else {
      this.botonGuardarDeshabilitado$.next(false);
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

    this.formularioSalida.patchValue({
      subtotal: subtotal,
      total: total,
      total_bruto: total_bruto,
    });
  }

  validarCamposDetalles() {
    let errores = false;
    Object.values(this.detalles.controls).find((control: any) => {
      if (control.get('item').value === null) {
        control.markAsTouched(); // Marcar el control como 'touched'
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.changeDetectorRef.detectChanges();
        this.alertaService.mensajeError(
          'Error en formulario',
          'El campo item no puede estar vacío',
        );
      }
      if (control.get('almacen').value === null) {
        control.markAsTouched(); // Marcar el control como 'touched'
        control.markAsDirty();
        errores = true;
        this.detalles.markAllAsTouched();
        this.detalles.markAsDirty();
        this.changeDetectorRef.detectChanges();
        this.alertaService.mensajeError(
          'Error en formulario',
          'El campo alamcen en los detalles no puede estar vacío',
        );
      }
    });
    this.changeDetectorRef.detectChanges();
    return errores;
  }

  private _consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarInvAlmacen>(
        'inventario/almacen/seleccionar/',
      ),
    ).subscribe((respuesta: any) => {
      let arrAlmacenes = respuesta[0];
      this.formularioSalida.patchValue({
        almacen: arrAlmacenes[0].id,
        almacenNombre: arrAlmacenes[0].nombre,
      });
      this.changeDetectorRef.detectChanges();
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

  // cargar vista
  private _cargarFormulario(id: number) {
    this._salidaService
      .consultarDetalle(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this._poblarFormulario(respuesta.documento);
      });
  }

  private _poblarFormulario(documentoFactura: DocumentoInventarioRespuesta) {
    this.estado_aprobado = documentoFactura.estado_aprobado;
    this._poblarDocumento(documentoFactura);
    this._poblarDocumentoDetalle(documentoFactura.detalles);
    this.changeDetectorRef.detectChanges();
  }

  private _poblarDocumento(documentoFactura: DocumentoInventarioRespuesta) {
    this.formularioSalida.patchValue({
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
    documentoDetalle.forEach((detalle, indexFormulario) => {
      const documentoDetalleGrupo = this._formBuilder.group({
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
        subtotal: [detalle.subtotal || 0],
        total_bruto: [detalle.total_bruto || 0],
        total: [detalle.total || 0],
      });
      this.detalles.push(documentoDetalleGrupo);
      this._calcularTotalesDetalle(indexFormulario);
    });

    this._actualizarTotalesFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _calcularTotalesDetalle(indexDetalle: number) {
    const detalle = this.detalles.value[indexDetalle];
    const total = this._operaciones.redondear(detalle.cantidad * detalle.precio, 2)
    // Actualizar correctamente usando el método patchValue en el control específico
    this.detalles.controls[indexDetalle].patchValue(
      {
        total: total,
        subtotal: total,
        total_bruto: total,
      },
      { emitEvent: false },
    );
  }

  private _limpiarFormularioTotales() {
    this.totalCantidad.set(0);
    this.totalPrecio.set(0);
  }
  private _actualizarTotalesFormulario() {
    let totalCantidad = 0;
    let totalGeneral = 0;
    totalCantidad += this._operaciones.sumarTotales(
      this.detalles.value,
      'cantidad',
    );

    totalGeneral += this._operaciones.sumarTotales(
      this.detalles.value,
      'subtotal',
    );

    this.totalCantidad.update(() => totalCantidad);
    this.totalPrecio.update(() => totalGeneral);

    this.total.update(() => totalGeneral);
  }
}
