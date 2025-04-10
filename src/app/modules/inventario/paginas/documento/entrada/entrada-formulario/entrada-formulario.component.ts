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
  BehaviorSubject,
  catchError,
  of,
  Subject,
  takeUntil,
  tap,
  zip,
} from 'rxjs';
import { ImportarDetallesComponent } from '../../../../../../comun/componentes/importar-detalles/importar-detalles.component';

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
  templateUrl: './entrada-formulario.component.html',
  styleUrl: './entrada-formulario.component.scss',
})
export default class EntradaFormularioComponent
  extends General
  implements OnInit
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
  public botonGuardarDeshabilitado$: BehaviorSubject<boolean>;
  public total = signal(0);
  public totalCantidad = signal(0);
  public totalPrecio = signal(0);

  constructor() {
    super();
    this.botonGuardarDeshabilitado$ = new BehaviorSubject<boolean>(false);
    this.formularioEntrada = this._formularioEntradaService.createForm();
  }

  ngOnInit() {
    this.active = 1;
    this._cargarVista();
    this._consultarInformacion();
  }

  get detalles(): FormArray {
    return this.formularioEntrada.get('detalles') as FormArray;
  }

  get detallesEliminados(): FormArray {
    return this.formularioEntrada.get('detalles_eliminados') as FormArray;
  }

  consultardetalle() {
    this._cargarFormulario(this.detalle);
  }

  enviarFormulario() {
    if (this.formularioEntrada.valid) {
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
      contacto: contacto.contacto_id,
      contactoNombre: contacto.contacto_nombre_corto,
    });
  }

  almacenSeleccionado(almacen: any) {
    this.formularioEntrada.patchValue({
      almacen: almacen.almacen_id,
      almacenNombre: almacen.almacen_nombre,
    });
  }

  almacenSeleccionadoDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: item.almacen_id,
      almacenNombre: item.almacen_nombre,
    });
    this.changeDetectorRef.detectChanges();
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
          // validarPrecio(),
          Validators.min(0),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,})?$'),
        ],
      ],
      almacen: [almacen, Validators.compose([Validators.required])],
      almacenNombre: [almacenNombre],
      id: [null],
      tipo_registro: ['I'],
    });

    this.formularioEntrada?.markAsDirty();
    this.formularioEntrada?.markAsTouched();

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
      });
    });

    this._limpiarFormularioTotales();
    this._actualizarFormulario();
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
    this._actualizarFormulario();
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
    this.formularioEntrada?.markAsDirty();
    this.formularioEntrada?.markAsTouched();
    this.changeDetectorRef.detectChanges();
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
    this.changeDetectorRef.detectChanges();
  }

  limpiarCampoAlmacenDetalle(item: any, indexFormulario: number) {
    this.detalles.controls[indexFormulario].patchValue({
      almacen: null,
      almacenNombre: null,
    });
    this.changeDetectorRef.detectChanges();
  }

  private _actualizarEntrada() {
    if (this.validarCamposDetalles() === false) {
      this._entradaService
        .actualizarDatos(this.detalle, this.formularioEntrada.value)
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
    this._actualizarFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _actualizarPrecioItem(indexFormulario: number, nuevoPrecio: number) {
    this.detalles.controls[indexFormulario].patchValue(
      { precio: nuevoPrecio },
      { emitEvent: false }, // ❗ Evita disparar valueChanges de nuevo
    );
    this._limpiarFormularioTotales();
    this._actualizarFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _guardarEntrada() {
    if (this.validarCamposDetalles() === false) {
      this._entradaService
        .guardarFactura({
          ...this.formularioEntrada.value,
          ...{
            numero: null,
            documento_tipo: 9,
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
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>(
        {
          filtros: [],
          limite: 1,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'InvAlmacen',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).subscribe((respuesta) => {
      let arrAlmacenes = respuesta[0].registros[0];
      this.formularioEntrada.patchValue({
        almacen: arrAlmacenes.almacen_id,
        almacenNombre: arrAlmacenes.almacen_nombre,
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
    this._entradaService
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
      });
      this.detalles.push(documentoDetalleGrupo);
    });
    this._actualizarFormulario();
    this.changeDetectorRef.detectChanges();
  }

  private _actualizarDetallesContactoSinDocumentoAfectado() {
    const detallesArray = this.formularioEntrada.get('detalles') as FormArray;

    if (detallesArray.length <= 0) {
      return false;
    }

    detallesArray.controls.forEach((control: AbstractControl) => {
      if (control.get('id')?.value === null) {
        const almacen =
          this.formularioEntrada.get('almacen')?.value !== ''
            ? this.formularioEntrada.get('almacen')?.value
            : null;

        const almacenNombre =
          this.formularioEntrada.get('almacenNombre')?.value !== ''
            ? this.formularioEntrada.get('almacenNombre')?.value
            : null;

        control.patchValue({
          almacen: almacen,
          almacenNombre: almacenNombre,
        });

        this.formularioEntrada.markAsTouched();
        this.formularioEntrada.markAsDirty();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private _limpiarFormularioTotales() {
    this.totalCantidad.set(0);
    this.totalPrecio.set(0);
  }

  private _actualizarFormulario() {
    let totalCantidad = 0;
    let totalPrecio = 0;
    totalCantidad += this._operaciones.sumarTotales(
      this.detalles.value,
      'cantidad',
    );

    totalPrecio += this._operaciones.sumarTotales(
      this.detalles.value,
      'precio',
    );

    this.totalCantidad.update(() => totalCantidad);
    this.totalPrecio.update(() => totalPrecio);

    this.total.update(() => this.totalCantidad() * this.totalPrecio());
  }
}
