import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';

@Component({
  selector: 'app-factura-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    NgbNavModule,
    TablaComponent,
    ImpuestosComponent,
    ProductosComponent,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
  ],
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.scss'],
})
export default class FacturaDetalleComponent extends General implements OnInit {
  informacionFormulario: any;
  formularioFactura: FormGroup;
  active: Number;
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  informacionDetalle: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    impuesto: 0,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
  };
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  accion: 'nuevo' | 'detalle';
  estado_aprobado: false;
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private facturaService: FacturaService
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
    this.active = 1;
    this.accion = this.activatedRoute.snapshot.queryParams['accion'];
    if (this.activatedRoute.snapshot.queryParams['detalle']) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  initForm() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioFactura = this.formBuilder.group({
      contacto: ['', Validators.compose([Validators.required])],
      contactoNombre: [''],
      numero: [null],
      fecha: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      fecha_vence: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      metodo_pago: ['', Validators.compose([Validators.required])],
      metodo_pago_nombre: [''],
      total: [0],
      subtotal: [0],
      detalles: this.formBuilder.array([]),
    },
    {
      validator: this.validarFecha,
    });
  }

  validarFecha(control: AbstractControl){
    const fecha = control.get('fecha')?.value
    const fecha_vence = control.get('fecha_vence')?.value

    if(fecha > fecha_vence){
      control.get('fecha')?.setErrors({ fechaSuperiorNoValida: true });
    } else {
      if (control.get('fecha_vence')?.getError("fechaVenceInferiorNoValida")) {
        control.get('fecha_vence')?.setErrors(null);
      }
    }

    if(fecha_vence < fecha){
      control.get('fecha_vence')?.setErrors({ fechaVenceInferiorNoValida: true });
    } else {
      if ( control.get('fecha')?.getError("fechaSuperiorNoValida")) {
        control.get('fecha')?.setErrors(null);
      }
    }

  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  formSubmit() {
    if (this.formularioFactura.valid) {
      if (this.detalle == undefined) {
        this.facturaService
          .guardarFactura(this.formularioFactura.value)
          .pipe(
            tap((respuesta) => {
              this.router.navigate(['/detalle'], {
                queryParams: {
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                  detalle: respuesta.documento.id,
                  accion: 'detalle',
                },
              });
            })
          )
          .subscribe();
      } else {
        if (this.formularioFactura.touched && this.formularioFactura.dirty) {
          this.facturaService
            .actualizarDatosFactura(this.detalle, {
              ...this.formularioFactura.value,
              ...{ detalles_eliminados: this.arrDetallesEliminado },
            })
            .subscribe((respuesta) => {
              this.detalles.clear();
              respuesta.documento.detalles.forEach(
                (detalle: any, indexDetalle: number) => {
                  const detalleFormGroup = this.formBuilder.group({
                    item: [detalle.item],
                    cantidad: [detalle.cantidad],
                    precio: [detalle.precio],
                    porcentaje_descuento: [detalle.porcentaje_descuento],
                    descuento: [detalle.descuento],
                    subtotal: [detalle.subtotal],
                    total_bruto: [detalle.total_bruto],
                    total: [detalle.total],
                    neto: [detalle.total],
                    item_nombre: [detalle.item_nombre],
                    impuestos: this.formBuilder.array([]),
                    impuestos_eliminados: this.formBuilder.array([]),
                    id: [detalle.id],
                  });

                  if (detalle.impuestos.length === 0) {
                    const cantidad = detalleFormGroup.get('cantidad')?.value;
                    const precio = detalleFormGroup.get('precio')?.value;
                    const neto = cantidad * precio;
                    detalleFormGroup.get('neto')?.setValue(neto);
                  }

                  this.detalles.push(detalleFormGroup);

                  detalle.impuestos.forEach((impuesto: any, index: number) => {
                    this.agregarImpuesto(
                      impuesto,
                      indexDetalle,
                      'actualizacion'
                    );
                  });
                }
              );
              this.detalle = respuesta.documento.id;

              this.arrDetallesEliminado = [];
              this.calcularTotales();
              this.formularioFactura.markAsPristine();
              this.formularioFactura.markAsUntouched();
              this.changeDetectorRef.detectChanges();
            });
        }
      }
    } else {
      console.log(this.formularioFactura)

      this.formularioFactura.markAllAsTouched();
    }
  }

  agregarProductos() {
    const detalleFormGroup = this.formBuilder.group({
      item: [null],
      item_nombre: [null],
      cantidad: [0],
      precio: [0],
      porcentaje_descuento: [0],
      descuento: [0],
      subtotal: [0],
      total_bruto: [0],
      total: [0],
      neto: [0],
      impuestos: this.formBuilder.array([]),
      impuestos_eliminados: this.formBuilder.array([]),
      id: [null],
    });
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();

    this.detalles.push(detalleFormGroup);
    this.changeDetectorRef.detectChanges();
  }

  onImpuestoBlur(index: number, estado_aprobado: boolean) {
    if (!estado_aprobado) {
      if (this.detalles.controls[index].get('item')?.value) {
        if (index === this.detalles.length - 1) {
          this.agregarProductos();
        }
      }
    }
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }

    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  agregarItemSeleccionado(item: any, index: number) {
    this.detalles.controls[index].patchValue({
      precio: item.precio,
      item: item.id,
      cantidad: 1,
      subtotal: item.precio * 1,
      item_nombre: item.nombre,
      total: item.precio * 1,
    });

    if (item.impuestos) {
      item.impuestos.map((impuesto: any) => {
        impuesto['item_impuesto_id'] = null;
        impuesto['nombre'] = impuesto['impuesto_nombre'];
        impuesto['compra'] = impuesto['impuesto_compra'];
        impuesto['venta'] = impuesto['impuesto_venta'];
        impuesto['porcentaje'] = impuesto['impuesto_porcentaje'];
        impuesto['id'] = null;
        this.agregarImpuesto(impuesto, index, 'agregar');
      });
    }
    this.calcularTotales()
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  calcularTotales() {
    this.totalCantidad = 0;
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalGeneral = 0;
    this.subtotalGeneral = 0;
    this.totalNetoGeneral = 0;

    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const cantidad = detalleControl.get('cantidad')?.value || 0;

      const precio = detalleControl.get('precio')?.value || 0;
      const porcentajeDescuento = detalleControl.get('descuento')?.value || 0;
      let subtotal = cantidad * precio;
      let descuento = (porcentajeDescuento * subtotal) / 100;
      let subtotalFinal = subtotal - descuento;

      const impuestos = detalleControl.get('impuestos')?.value || [];
      impuestos.forEach((impuesto: any) => {
        this.totalImpuestos += impuesto.total;
      });

      let neto = detalleControl.get('neto')?.value || 0;

      this.totalCantidad += parseInt(cantidad);
      this.totalDescuento += descuento;
      this.subtotalGeneral += subtotalFinal;
      this.totalNetoGeneral += neto;

      detalleControl.get('subtotal')?.patchValue(subtotalFinal);
      detalleControl.get('neto')?.patchValue(neto);
      this.changeDetectorRef.detectChanges();
    });

    this.totalGeneral = this.subtotalGeneral + this.totalImpuestos;
    this.formularioFactura.patchValue({
      total: this.totalGeneral,
      subtotal: this.subtotalGeneral,
    })
  }

  eliminarProducto(index: number, id: number | null) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;

    if (id != null) {
      this.arrDetallesEliminado.push(id);
    }

    if (detalleFormGroup.value.impuestos.length > 0) {
      for (const impuestoIndex in this.acumuladorImpuestos) {
        const impuesto = this.acumuladorImpuestos[impuestoIndex];

        impuesto.data = impuesto.data.filter((item: any) => {
          return item.index !== index;
        });

        // Verificar si el tamaño de data es cero y eliminar la posición si es así
        if (impuesto.data.length <= 0) {
          delete this.acumuladorImpuestos[impuestoIndex];
        } else {
          let totalImpuesto = 0;

          if (impuesto.data[0]) {
            totalImpuesto =
              (subtotal.value * impuesto.data[0].porcentaje) / 100;
            impuesto.total -= totalImpuesto;
          }
        }
      }
    }

    this.changeDetectorRef.detectChanges();
    this.detalles.removeAt(index);
    this.calcularTotales();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    console.log(evento.target.value !== '');

    if (evento.target.value !== '') {
      detalleFormGroup.get(campo)?.patchValue(evento.target.value);
    } else {
      detalleFormGroup.get(campo)?.patchValue(0);
    }

    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    let impuestoTotal = 0;
    this.calcularTotales();

    let impuestoTemporales = arrDetalleImpuestos.value;

    arrDetalleImpuestos.clear();

    impuestoTemporales.map((impuesto: any) => {
      let totalImpuesto = (subtotal.value * impuesto.porcentaje) / 100;
      let impuestoFormGrup = this.formBuilder.group({
        id: [impuesto.impuesto_id ? impuesto.id : null],
        impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id],
        base: [subtotal.value],
        porcentaje: [impuesto.porcentaje],
        total: [totalImpuesto],
        nombre: [impuesto.nombre],
        nombre_extendido: [impuesto.nombre_extendido],
        impuesto_id: [impuesto.impuesto_id],
        impuesto_nombre_extendido: [impuesto.nombre_extendido],
        impuesto_nombre: [impuesto.nombre],
      });
      arrDetalleImpuestos.push(impuestoFormGrup);
      this.acumuladorImpuestos[impuesto.nombre_extendido].total +=
        totalImpuesto - impuesto.total;
      impuestoTotal += totalImpuesto;

      this.changeDetectorRef.detectChanges();
    });
    neto.patchValue(subtotal.value + impuestoTotal);
    total.patchValue(subtotal.value + impuestoTotal);
    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  agregarImpuesto(
    impuesto: any,
    index: number,
    accion: 'actualizacion' | 'agregar'
  ) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    impuesto = {
      ...impuesto,
      index,
    };
    let totalImpuesto = impuesto.total;
    if (accion == 'agregar') {
      totalImpuesto = (subtotal.value * impuesto.impuesto_porcentaje) / 100;
    }

    if (impuesto.hasOwnProperty('impuesto_nombre')) {
      impuesto['nombre'] = impuesto['impuesto_nombre'];
    }
    if (impuesto.hasOwnProperty('impuesto_nombre_extendido')) {
      impuesto['nombre_extendido'] = impuesto['impuesto_nombre_extendido'];
    }
    if (impuesto.hasOwnProperty('impuesto_porcentaje')) {
      impuesto['porcentaje'] = impuesto['impuesto_porcentaje'];
    }
    let impuestoFormGrup = this.formBuilder.group({
      id: [accion === 'actualizacion' ? impuesto.id : null], //id tabla intermedia entre documento y impuesto
      impuesto: [impuesto.impuesto_id ? impuesto.impuesto_id : impuesto.id], //id
      base: [subtotal.value === null ? 0 : subtotal.value],
      porcentaje: [impuesto.porcentaje],
      total: [totalImpuesto],
      nombre: [impuesto.nombre],
      nombre_extendido: [impuesto.nombre_extendido],
      impuesto_id: [impuesto.impuesto_id],
      impuesto_nombre_extendido: [impuesto.nombre_extendido],
      impuesto_nombre: [impuesto.nombre],
    });
    arrDetalleImpuestos.push(impuestoFormGrup);
    this.changeDetectorRef.detectChanges();

    if (!this.acumuladorImpuestos[impuesto.nombre_extendido]) {
      this.acumuladorImpuestos[impuesto.nombre_extendido] = {
        total: totalImpuesto,
        data: [impuesto],
      };
    } else {
      const existingData =
        this.acumuladorImpuestos[impuesto.nombre_extendido].data;

      const impuestoExistente = existingData.find(
        (item: any) => item.index === impuesto.index
      );

      if (!impuestoExistente) {
        this.acumuladorImpuestos[impuesto.nombre_extendido].total +=
          totalImpuesto;
        this.acumuladorImpuestos[impuesto.nombre_extendido].data.push(impuesto);
      }
    }
    let netoTemporal = total.value;
    if (accion == 'actualizacion') {
      if (detalleFormGroup.value.impuestos.length == 1) {
        netoTemporal = subtotal.value;
        netoTemporal += totalImpuesto;
      } else {
        netoTemporal = neto.value;
        netoTemporal += totalImpuesto;
      }
    }

    if (netoTemporal == 0 || netoTemporal == null) {
      netoTemporal = subtotal.value + totalImpuesto;
    }

    if (accion == 'agregar') {
      netoTemporal += totalImpuesto;
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  removerImpuesto(impuesto: any, index: number) {
    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const total = detalleFormGroup.get('total') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    const arrDetalleImpuestosEliminado = detalleFormGroup.get(
      'impuestos_eliminados'
    ) as FormArray;
    const neto = detalleFormGroup.get('neto') as FormControl;

    let nuevosImpuestos = arrDetalleImpuestos.value.filter(
      (item: any) => item.impuesto_id !== impuesto.impuesto_id
    );

    let totalImpuesto = (subtotal.value * impuesto.porcentaje) / 100;
    // Limpiar el FormArray actual
    arrDetalleImpuestos.clear();
    // Agregar los impuestos filtrados de nuevo al FormArray
    nuevosImpuestos.forEach((nuevoImpuesto: any) => {
      const nuevoDetalle = this.formBuilder.group({
        id: [nuevoImpuesto.id], //id tabla intermedia entre documento y impuesto
        impuesto: [nuevoImpuesto.impuesto], //id
        base: [neto.value === null ? 0 : neto.value],
        porcentaje: [nuevoImpuesto.porcentaje],
        total: [(subtotal.value * nuevoImpuesto.porcentaje) / 100],
        nombre: [nuevoImpuesto.nombre],
        nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_id: [nuevoImpuesto.impuesto_id],
        impuesto_nombre_extendido: [nuevoImpuesto.nombre_extendido],
        impuesto_nombre: [nuevoImpuesto.nombre],
      });
      arrDetalleImpuestos.push(nuevoDetalle);
    });

    if (impuesto.id) {
      arrDetalleImpuestosEliminado.push(this.formBuilder.control(impuesto.id));
    }

    this.acumuladorImpuestos[impuesto.nombre_extendido].data =
      this.acumuladorImpuestos[impuesto.nombre_extendido].data.filter(
        (impuestoAcumulado: any) => impuestoAcumulado.index !== index
      );

    if (this.acumuladorImpuestos[impuesto.nombre_extendido].data.length === 0) {
      delete this.acumuladorImpuestos[impuesto.nombre_extendido];
      this.changeDetectorRef.detectChanges();
    }

    if (
      this.acumuladorImpuestos[impuesto.nombre_extendido]?.total !== undefined
    ) {
      this.acumuladorImpuestos[impuesto.nombre_extendido].total -=
        impuesto.total;
    }

    let netoTemporal = neto.value;

    if (netoTemporal > 0) {
      netoTemporal -= totalImpuesto;
    }

    neto.patchValue(netoTemporal);
    total.patchValue(netoTemporal);
    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto') {
      this.formularioFactura.get(campo)?.setValue(dato.contacto_id);
      this.formularioFactura
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
    }
    if (campo === 'metodo_pago') {
      this.formularioFactura.get(campo)?.setValue(dato.metodo_pago_id);
      this.formularioFactura
        .get('metodo_pago_nombre')
        ?.setValue(dato.metodo_pogo_nombre);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'nombre_corto__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Contacto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  consultarMetodo(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'nombre__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'MetodoPago',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMetodosPago = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  actualizarDatos(event: any, campo: string) {
    let data: any = {
      documento_tipo: 1,
    };

    data[campo] = event.target.innerText;
    this.facturaService.actualizarDatosFactura(this.detalle, data);
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionDetalle = respuesta.documento;
        this.estado_aprobado = respuesta.documento.estado_aprobado;
        this.formularioFactura.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          fecha_vence: respuesta.documento.fecha_vence,
          metodo_pago: respuesta.documento.metodo_pago_id,
          metodo_pago_nombre: respuesta.documento.metodo_pago_nombre,
        });
        this.detalles.clear();
        respuesta.documento.detalles.forEach(
          (detalle: any, indexDetalle: number) => {
            const detalleFormGroup = this.formBuilder.group({
              item: [detalle.item],
              item_nombre: [detalle.item_nombre],
              cantidad: [detalle.cantidad],
              precio: [detalle.precio],
              porcentaje_descuento: [detalle.porcentaje_descuento],
              descuento: [detalle.descuento],
              subtotal: [detalle.subtotal],
              total_bruto: [detalle.total_bruto],
              total: [detalle.total],
              neto: [detalle.neto],
              impuestos: this.formBuilder.array([]),
              impuestos_eliminados: this.formBuilder.array([]),
              id: [detalle.id],
            });
            this.detalles.push(detalleFormGroup);

            detalle.impuestos.forEach((impuesto: any) => {
              this.agregarImpuesto(impuesto, indexDetalle, 'actualizacion');
            });
          }
        );
        if (respuesta.documento.estado_aprobado) {
          this.formularioFactura.disable();
        } else {
          this.formularioFactura.markAsPristine();
          this.formularioFactura.markAsUntouched();
        }
        this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }
}
